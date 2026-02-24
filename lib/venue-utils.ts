/**
 * Shared venue/assignment utilities
 * Extracted from feedback API for reuse by LINE integration, cron jobs, etc.
 */

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Check if a DJ shift has ended based on Bangkok time.
 *
 * endTime is stored as Bangkok local time (e.g., "21:00").
 * Overnight shifts ending before 6 AM are treated as ending the next day.
 * The server may run in UTC, so we convert to Bangkok time for comparison.
 */
export function hasShiftEnded(assignmentDate: Date, endTime: string): boolean {
  const [hours, mins] = endTime.split(':').map(Number);

  // Create end datetime starting from assignment date
  const endDateTime = new Date(assignmentDate);
  endDateTime.setHours(hours, mins, 0, 0);

  // If end time is before 6 AM, it's an overnight shift ending the NEXT day
  if (hours < 6) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }

  // Get current time in Bangkok (UTC+7)
  const now = new Date();
  const bangkokNow = new Date(now.getTime() + BANGKOK_OFFSET_MS);

  return endDateTime <= bangkokNow;
}

/**
 * Format a date as YYYY-MM-DD using local values (avoids timezone shift).
 */
export function formatDateLocal(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Get current date in Bangkok timezone as a Date object (midnight).
 */
export function getBangkokToday(): Date {
  const now = new Date();
  const bangkokNow = new Date(now.getTime() + BANGKOK_OFFSET_MS);
  bangkokNow.setHours(0, 0, 0, 0);
  return bangkokNow;
}
