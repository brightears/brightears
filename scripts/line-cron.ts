/**
 * LINE Cron Job
 *
 * Runs every 30 minutes on Render (schedule: every-30-min).
 * Only acts during two daily windows:
 *
 * 1. 8am Bangkok (1:00 UTC) → Schedule reminders to DJ + manager groups
 * 2. 9pm-1:30am Bangkok (14:00-18:00 UTC) → Feedback cards for ended shifts
 *
 * Outside these windows, the script is a no-op.
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
  const utcHour = new Date().getUTCHours();
  const utcMinutes = new Date().getUTCMinutes();

  // 8am Bangkok (1:00 UTC) → Schedule reminders to DJ groups + manager groups
  // Only on the :00 run, not :30 (cron fires twice per hour)
  if (utcHour === 1 && utcMinutes < 15) {
    await callPushAPI('dj_reminder');
  }

  // 9pm-1:30am Bangkok (14:00-18:00 UTC) → Feedback cards for ended shifts
  // Runs ~10 times in this window; hasShiftEnded() + feedbackRequestSentAt
  // ensure each card is sent exactly once, within 30 min of shift ending.
  if (utcHour >= 14 && utcHour <= 18) {
    await callPushAPI('feedback_requests');
  }

  console.log('[LINE Cron] Done.');
}

main().catch((err) => {
  console.error('[LINE Cron] Fatal error:', err);
  process.exit(1);
});
