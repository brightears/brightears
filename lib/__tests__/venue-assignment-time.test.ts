import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  addAssignmentDays, assignmentEndInstant, assignmentHasEnded,
  assignmentMonthBounds, bangkokAssignmentToday, upcomingAssignments,
} from '../venue-assignment-time'

const date = new Date('2026-09-09T00:00:00.000Z')
const slot = (startTime: string, endTime: string) => ({ date, startTime, endTime })

test('Bangkok midnight produces a UTC-midnight DATE key and correct month boundary', () => {
  assert.equal(bangkokAssignmentToday(new Date('2026-09-30T16:59:59Z')).toISOString(), '2026-09-30T00:00:00.000Z')
  const today = bangkokAssignmentToday(new Date('2026-09-30T17:00:00Z'))
  assert.equal(today.toISOString(), '2026-10-01T00:00:00.000Z')
  assert.equal(addAssignmentDays(today, -1).toISOString(), '2026-09-30T00:00:00.000Z')
  const month = assignmentMonthBounds(today)
  assert.equal(month.start.toISOString(), '2026-10-01T00:00:00.000Z')
  assert.equal(month.endExclusive.toISOString(), '2026-11-01T00:00:00.000Z')
})

test('DATE arithmetic handles leap days and year rollover', () => {
  assert.equal(addAssignmentDays(new Date('2024-03-01T00:00:00Z'), -1).toISOString(), '2024-02-29T00:00:00.000Z')
  assert.equal(addAssignmentDays(new Date('2026-12-31T00:00:00Z'), 1).toISOString(), '2027-01-01T00:00:00.000Z')
})

test('results do not depend on the web server timezone', () => {
  const previousTimeZone = process.env.TZ
  try {
    for (const timezone of ['UTC', 'Asia/Bangkok', 'America/New_York']) {
      process.env.TZ = timezone
      assert.equal(bangkokAssignmentToday(new Date('2026-09-30T17:00:00Z')).toISOString(), '2026-10-01T00:00:00.000Z')
      assert.equal(assignmentEndInstant(slot('23:00', '02:00'))?.toISOString(), '2026-09-09T19:00:00.000Z')
    }
  } finally {
    if (previousTimeZone === undefined) delete process.env.TZ
    else process.env.TZ = previousTimeZone
  }
})

test('the schema midnight value 24:00 ends at the next Bangkok midnight', () => {
  assert.equal(assignmentEndInstant(slot('20:00', '24:00'))?.toISOString(), '2026-09-09T17:00:00.000Z')
})

test('overnight rollover compares start and end instead of using a 6 AM cutoff', () => {
  assert.equal(assignmentEndInstant(slot('23:00', '02:00'))?.toISOString(), '2026-09-09T19:00:00.000Z')
  assert.equal(assignmentEndInstant(slot('23:00', '07:00'))?.toISOString(), '2026-09-10T00:00:00.000Z')
  assert.equal(assignmentEndInstant(slot('01:00', '05:00'))?.toISOString(), '2026-09-08T22:00:00.000Z')
})

test('a shift remains upcoming until its exact Bangkok end instant', () => {
  const overnight = slot('23:00', '02:00')
  const during = new Date('2026-09-09T18:00:00Z') // 01:00 Bangkok on September 10
  assert.equal(bangkokAssignmentToday(during).toISOString(), '2026-09-10T00:00:00.000Z')
  assert.equal(assignmentHasEnded(overnight, during), false)
  assert.deepEqual(upcomingAssignments([overnight], during), [overnight])
  assert.equal(assignmentHasEnded(overnight, new Date('2026-09-09T19:00:00Z')), true)
  assert.deepEqual(upcomingAssignments([overnight], new Date('2026-09-09T19:00:00Z')), [])
})

test('today evening survives DATE filtering while an ended morning shift is excluded', () => {
  const morning = { ...slot('08:00', '10:00'), id: 'morning' }
  const evening = { ...slot('20:00', '24:00'), id: 'evening' }
  const tomorrow = { ...evening, id: 'tomorrow', date: addAssignmentDays(date, 1) }
  assert.deepEqual(
    upcomingAssignments([morning, evening, tomorrow], new Date('2026-09-09T12:00:00Z')).map(a => a.id),
    ['evening', 'tomorrow'],
  )
})

test('malformed clock values cannot accidentally mark a shift ended', () => {
  for (const time of ['24:01', '25:00', '09:60', 'unknown']) {
    const invalid = slot('20:00', time)
    assert.equal(assignmentEndInstant(invalid), null)
    assert.equal(assignmentHasEnded(invalid, new Date('2030-01-01T00:00:00Z')), false)
  }
})
