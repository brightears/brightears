/**
 * Admin LINE Push API
 *
 * POST /api/admin/line/push
 *   Proxies to /api/line/push with admin auth instead of API key.
 *   Accepts same body: { action, message?, role?, date? }
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.LINE_PUSH_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'LINE_PUSH_API_KEY not configured' }, { status: 500 });
  }

  const body = await req.json();

  // Forward to the push API with the API key
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.io';
  const res = await fetch(`${appUrl}/api/line/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
