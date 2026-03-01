/**
 * LINE Cron Job
 *
 * Runs every 30 minutes on Render to:
 * 1. Send feedback requests for ended shifts (always)
 * 2. Send DJ reminders at ~4pm Bangkok time (9am UTC)
 *
 * Calls the existing /api/line/push endpoint with the LINE_PUSH_API_KEY.
 *
 * Environment variables:
 *   APP_URL          - e.g. https://brightears.io
 *   LINE_PUSH_API_KEY - Bearer token for push API
 */

const APP_URL = process.env.APP_URL || 'https://brightears.io';
const API_KEY = process.env.LINE_PUSH_API_KEY;

if (!API_KEY) {
  console.error('LINE_PUSH_API_KEY is not set');
  process.exit(1);
}

async function callPushAPI(action: string, extra?: Record<string, unknown>) {
  const url = `${APP_URL}/api/line/push`;
  const body = { action, ...extra };

  console.log(`[LINE Cron] Calling ${action}...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`[LINE Cron] ${action} failed:`, data);
    return;
  }

  console.log(`[LINE Cron] ${action} result:`, JSON.stringify(data));
}

async function main() {
  // Always send feedback requests for ended shifts
  await callPushAPI('feedback_requests');

  // Send DJ reminders once daily around 8am Bangkok (1am UTC)
  // Since cron runs every 30 min, check if current UTC hour is 1
  const utcHour = new Date().getUTCHours();
  const utcMinute = new Date().getUTCMinutes();

  // Run DJ reminders between 1:00-1:29 UTC (8:00-8:29am Bangkok)
  if (utcHour === 1 && utcMinute < 30) {
    await callPushAPI('dj_reminder');
  }

  console.log('[LINE Cron] Done.');
}

main().catch((err) => {
  console.error('[LINE Cron] Fatal error:', err);
  process.exit(1);
});
