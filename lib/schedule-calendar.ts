/** Calendar exports use the agency's Bangkok performance dates, not browser time. */
export interface CalendarAssignment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  venue: string;
  status: string;
}

export function bangkokDate(value: string | Date): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  return ['year', 'month', 'day'].map(type => parts.find(p => p.type === type)?.value).join('-');
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

// RFC 5545 lines are folded at 75 octets without splitting a UTF-8 character.
function fold(line: string): string {
  const encoder = new TextEncoder();
  let output = '', size = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (size + bytes > 75) { output += '\r\n '; size = 1; }
    output += character;
    size += bytes;
  }
  return output;
}

function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function scheduleCalendar(assignments: CalendarAssignment[], now = new Date()): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bright Ears//Agency Schedule//EN', 'CALSCALE:GREGORIAN'];
  for (const assignment of assignments) {
    const day = bangkokDate(assignment.date);
    const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (!day || !validTime.test(assignment.startTime) || !(validTime.test(assignment.endTime) || assignment.endTime === '24:00')) continue;
    if (!['SCHEDULED', 'COMPLETED', 'CANCELLED'].includes(assignment.status)) continue;
    const start = new Date(`${day}T${assignment.startTime}:00+07:00`);
    const end = new Date(`${day}T${assignment.endTime}:00+07:00`);
    if (end <= start) end.setUTCDate(end.getUTCDate() + 1);
    lines.push('BEGIN:VEVENT', `UID:${encodeURIComponent(assignment.id)}@brightears.io`,
      `DTSTAMP:${stamp(now)}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${escapeText(assignment.title)}`, `LOCATION:${escapeText(assignment.venue)}`,
      `STATUS:${assignment.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED'}`,
      'DESCRIPTION:Schedule snapshot from Bright Ears. Check your portal for the latest changes.',
      'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
