/**
 * Venue Agent — LLM router endpoint.
 *
 * Single entry point for all agent-side LLM calls. Routes to OpenRouter
 * (cheap default models like Qwen 3 / DeepSeek V4) with Claude as
 * fallback for tasks flagged as needing higher quality.
 *
 * Per-tenant token usage is logged to AgentLlmUsage so billing reflects
 * real spend.
 *
 * Started 2026-04-29. NOT WIRED to UI yet — endpoint stub for build phase.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
type Body = {
  tenantId: string;
  taskType?: string;          // "chat" | "draft_email" | "schedule_suggest"
  messages: ChatMessage[];
  preferQuality?: boolean;    // if true, route to Claude
  maxTokens?: number;
};

// Environment-driven config. Real keys land in Render env when deployed.
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const DEFAULT_MODEL = process.env.AGENT_DEFAULT_MODEL ?? 'qwen/qwen3-72b-instruct';
const PREMIUM_MODEL = process.env.AGENT_PREMIUM_MODEL ?? 'claude-sonnet-4-6';

export async function POST(req: Request) {
  // Auth: service-to-service. Real implementation verifies tenant from
  // Clerk session + checks AgentMember.role. Stub for now.
  const apiKey = req.headers.get('x-agent-key');
  if (!apiKey || apiKey !== process.env.AGENT_INTERNAL_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { tenantId, taskType, messages, preferQuality, maxTokens } = body;
  if (!tenantId || !messages?.length) {
    return NextResponse.json({ error: 'Missing tenantId or messages' }, { status: 400 });
  }

  const tenant = await prisma.agentTenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    return NextResponse.json({ error: 'Unknown tenant' }, { status: 404 });
  }

  if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
    return NextResponse.json({ error: 'Tenant not active' }, { status: 403 });
  }

  // Token budget check. Hard-cap on monthly allowance unless top-up credits exist.
  if (
    tenant.monthlyTokenUsed >= tenant.monthlyTokenAllowance &&
    tenant.topUpCreditsRemaining <= 0
  ) {
    return NextResponse.json(
      { error: 'Monthly token allowance exceeded. Purchase top-up credits to continue.' },
      { status: 402 },
    );
  }

  const model = preferQuality ? PREMIUM_MODEL : DEFAULT_MODEL;
  const provider = preferQuality ? 'anthropic' : 'openrouter';

  const startedAt = Date.now();
  let inputTokens = 0;
  let outputTokens = 0;
  let costUsd = 0;
  let assistantText = '';

  try {
    if (provider === 'openrouter') {
      if (!OPENROUTER_KEY) {
        return NextResponse.json(
          { error: 'OPENROUTER_API_KEY not configured' },
          { status: 500 },
        );
      }
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens ?? 1024,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data?.error ?? 'OpenRouter error' }, { status: 502 });
      }
      assistantText = data?.choices?.[0]?.message?.content ?? '';
      inputTokens = data?.usage?.prompt_tokens ?? 0;
      outputTokens = data?.usage?.completion_tokens ?? 0;
      // OpenRouter returns the cost on the response when available
      costUsd = Number(data?.usage?.cost ?? 0);
    } else {
      // Anthropic (premium fallback)
      if (!ANTHROPIC_KEY) {
        return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
      }
      const systemPrompt = messages.find((m) => m.role === 'system')?.content;
      const conversation = messages.filter((m) => m.role !== 'system');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          system: systemPrompt,
          messages: conversation,
          max_tokens: maxTokens ?? 1024,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data?.error ?? 'Anthropic error' }, { status: 502 });
      }
      assistantText = data?.content?.[0]?.text ?? '';
      inputTokens = data?.usage?.input_tokens ?? 0;
      outputTokens = data?.usage?.output_tokens ?? 0;
      // Cost approx — Anthropic doesn't return cost; we compute from price tiers later.
      costUsd = (inputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;
    }

    // Persist usage + decrement tenant allowance.
    const totalTokens = inputTokens + outputTokens;
    await prisma.$transaction([
      prisma.agentLlmUsage.create({
        data: {
          tenantId,
          model,
          provider,
          inputTokens,
          outputTokens,
          costUsd,
          taskType: taskType ?? 'chat',
          durationMs: Date.now() - startedAt,
        },
      }),
      prisma.agentTenant.update({
        where: { id: tenantId },
        data: {
          monthlyTokenUsed: { increment: totalTokens },
          // Top-up credits drain only after the monthly allowance is exhausted.
          topUpCreditsRemaining:
            tenant.monthlyTokenUsed >= tenant.monthlyTokenAllowance
              ? { decrement: totalTokens }
              : undefined,
        },
      }),
    ]);

    return NextResponse.json({
      content: assistantText,
      model,
      usage: { inputTokens, outputTokens, totalTokens, costUsd },
    });
  } catch (err: any) {
    console.error('[agent.chat] error', err);
    return NextResponse.json(
      { error: err?.message ?? 'Agent chat failed' },
      { status: 500 },
    );
  }
}
