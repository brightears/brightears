import assert from 'node:assert/strict';
import test from 'node:test';
import type { PrismaClient } from '@prisma/client';
import { createAiGenerationHandlers } from '../ai-generation-service';
import { AiProviderError, GENERATION_TIMEOUT_MS } from '../ai-generation-policy';

function guardedDependencies(user: { id: string; role: string } | null, configured = true) {
  let dbCalls = 0, providerCalls = 0, configurationChecks = 0;
  const db = new Proxy({}, { get() { dbCalls++; throw new Error('Database should not be reached'); } }) as PrismaClient;
  return { deps: { db, getCurrentUser: async () => user, isConfigured: () => { configurationChecks++; return configured; }, generate: async () => { providerCalls++; throw new Error('Provider should not be reached'); } }, counts: () => ({ dbCalls, providerCalls, configurationChecks }) };
}

test('anonymous POST and GET stop before body, configuration, database or provider work', async () => {
  const { deps, counts } = guardedDependencies(null);
  const handlers = createAiGenerationHandlers(deps);
  const request = new Request('http://fixture.invalid', { method: 'POST', body: 'fixture-private-image', headers: { 'content-length': '9999999999' } });
  for (const response of [await handlers.POST(request), await handlers.GET()]) {
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('x-robots-tag'), 'noindex');
    assert.deepEqual(await response.json(), { error: 'Authentication required' });
  }
  assert.equal(request.bodyUsed, false);
  assert.deepEqual(counts(), { dbCalls: 0, providerCalls: 0, configurationChecks: 0 });
});

test('unconfigured provider stops authenticated requests before body or credit reservation', async () => {
  const { deps, counts } = guardedDependencies({ id: 'fixture', role: 'ARTIST' }, false);
  const request = new Request('http://fixture.invalid', { method: 'POST', body: 'not JSON' });
  const response = await createAiGenerationHandlers(deps).POST(request);
  assert.equal(response.status, 503);
  assert.equal(request.bodyUsed, false);
  assert.deepEqual(counts(), { dbCalls: 0, providerCalls: 0, configurationChecks: 1 });
});

test('invalid authenticated input stops before database/provider; unexpected auth errors are not disclosed', async () => {
  const { deps, counts } = guardedDependencies({ id: 'fixture', role: 'CORPORATE' });
  const handlers = createAiGenerationHandlers(deps);
  assert.equal((await handlers.POST(new Request('http://fixture.invalid', { method: 'POST', body: '{}' }))).status, 400);
  assert.deepEqual(counts(), { dbCalls: 0, providerCalls: 0, configurationChecks: 1 });
  const response = await createAiGenerationHandlers({ ...deps, getCurrentUser: async () => { throw new Error('fixture-secret-auth-detail'); } }).GET();
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /fixture-secret/);
});

test('Gemini transport passes an abort signal and classifies timeout/5xx as unknown without leaking SDK messages', async t => {
  const oldKey = process.env.GOOGLE_GEMINI_API_KEY;
  process.env.GOOGLE_GEMINI_API_KEY = 'fixture-not-a-secret';
  const originalFetch = globalThis.fetch;
  try {
    const { generateContentImage } = await import('../api/gemini-image-client');
    const input = { sourceImageBase64: 'fixture', sourceMimeType: 'image/png', contentType: 'EVENT_POSTER' as const };
    let calls = 0;
    let signal: AbortSignal | undefined;
    globalThis.fetch = async (_url, options) => {
      calls++;
      signal = options?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(new Error('fixture-secret-SDK-url')), { once: true });
      });
    };
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const pending = generateContentImage(input);
    // The SDK constructs the request asynchronously before calling fetch.
    for (let i = 0; i < 20 && !signal; i++) await Promise.resolve();
    assert.ok(signal, 'actual SDK fetch receives an AbortSignal');
    assert.equal(signal.aborted, false);
    const failure = assert.rejects(pending, (error: unknown) => error instanceof AiProviderError && error.kind === 'unknown' && !error.message.includes('fixture-secret'));
    t.mock.timers.tick(GENERATION_TIMEOUT_MS);
    await failure;
    assert.equal(signal.aborted, true);
    assert.equal(calls, 1);
    t.mock.timers.reset();
    for (const [status, expected] of [[429, 'quota'], [400, 'rejected'], [503, 'unknown'], [408, 'unknown'], [499, 'unknown']] as const) {
      globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'fixture-secret-provider-text' } }), { status, headers: { 'content-type': 'application/json' } });
      await assert.rejects(generateContentImage(input), (error: unknown) => error instanceof AiProviderError && error.kind === expected && !error.message.includes('fixture-secret'));
    }
    for (const reason of ['API_KEY_INVALID', 'BILLING_DISABLED', 'SERVICE_DISABLED', 'ACCESS_DENIED']) {
      // Exercise the real SDK's error.details -> errorDetails conversion.
      globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'fixture-secret-configuration', details: [{ '@type': 'type.googleapis.com/google.rpc.ErrorInfo', reason, metadata: { service: 'fixture-private-provider' } }] } }), { status: 400, headers: { 'content-type': 'application/json' } });
      await assert.rejects(generateContentImage(input), (error: unknown) => error instanceof AiProviderError && error.kind === 'unavailable' && !error.message.includes('fixture-secret'));
    }
    globalThis.fetch = async () => new Response('malformed potential-success JSON', { status: 200 });
    await assert.rejects(generateContentImage(input), (error: unknown) => error instanceof AiProviderError && error.kind === 'unknown');
    for (const [body, expected] of [
      [{ candidates: [{ index: 0, finishReason: 'SAFETY' }] }, 'rejected'],
      [{ promptFeedback: { blockReason: 'SAFETY' } }, 'rejected'],
      [{ candidates: [{ index: 0, finishReason: 'STOP' }] }, 'unknown'],
      [{}, 'unknown'],
    ] as const) {
      globalThis.fetch = async () => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
      await assert.rejects(generateContentImage(input), (error: unknown) => error instanceof AiProviderError && error.kind === expected);
    }
  } finally {
    t.mock.timers.reset();
    globalThis.fetch = originalFetch;
    if (oldKey === undefined) delete process.env.GOOGLE_GEMINI_API_KEY; else process.env.GOOGLE_GEMINI_API_KEY = oldKey;
  }
});
