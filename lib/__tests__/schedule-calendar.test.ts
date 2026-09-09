import test from 'node:test';
import assert from 'node:assert/strict';
import { bangkokDate, scheduleCalendar } from '../schedule-calendar';

const assignment = { id: 'shift-1', date: '2026-09-30T00:00:00.000Z', startTime: '22:00', endTime: '02:00', title: 'DJ set', venue: 'Bangkok', status: 'SCHEDULED' };
test('overnight Bangkok sets cross the month boundary in UTC correctly', () => {
  const output = scheduleCalendar([assignment], new Date('2026-09-09T00:00:00Z'));
  assert.match(output, /DTSTART:20260930T150000Z/);
  assert.match(output, /DTEND:20260930T190000Z/);
  assert.equal(bangkokDate('2026-09-30T18:00:00Z'), '2026-10-01');
});
test('untrusted event text cannot inject calendar properties and UTF-8 lines stay within 75 bytes', () => {
  const output = scheduleCalendar([{ ...assignment, title: 'ชื่อดีเจ'.repeat(30) + '\r\nATTENDEE:evil', venue: 'Room, bar; lounge\\roof' }]);
  assert.ok(!output.split('\r\n').some(line => line.startsWith('ATTENDEE:')));
  assert.match(output, /LOCATION:Room\\, bar\\; lounge\\\\roof/);
  for (const line of output.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  assert.ok(output.replace(/\r\n /g, '').includes('ชื่อดีเจ'.repeat(30)));
});
test('invalid times and no-shows are skipped, cancellations retain the same UID', () => {
  const output = scheduleCalendar([{ ...assignment, status: 'CANCELLED' }, { ...assignment, id: 'invalid', startTime: '25:00' }, { ...assignment, id: 'absent', status: 'NO_SHOW' }]);
  assert.equal((output.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.match(output, /UID:shift-1@brightears.io/);
  assert.match(output, /STATUS:CANCELLED/);
});
test('the database convention 24:00 represents the following midnight', () => {
  const output = scheduleCalendar([{ ...assignment, endTime: '24:00' }]);
  assert.match(output, /DTEND:20260930T170000Z/);
  assert.equal((output.match(/BEGIN:VEVENT/g) || []).length, 1);
});
