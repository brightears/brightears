const DAY_MS = 24 * 60 * 60 * 1000
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000

export interface AssignmentTiming {
  date: Date
  startTime: string
  endTime: string
}

/**
 * VenueAssignment.date is PostgreSQL DATE, exposed by Prisma at UTC midnight.
 * This value is a calendar key, not the instant at which a Bangkok shift starts.
 * Use UTC arithmetic on that key; server-local setHours/getDate changes its day.
 */
export function addAssignmentDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days))
}

/** The current Bangkok calendar day, encoded as the same UTC-midnight DATE key. */
export function bangkokAssignmentToday(now: Date): Date {
  const bangkokClock = new Date(now.getTime() + BANGKOK_OFFSET_MS)
  return addAssignmentDays(bangkokClock, 0)
}

export function assignmentMonthBounds(day: Date) {
  return {
    start: new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1)),
    endExclusive: new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 1)),
  }
}

function clockMinutes(value: string): number | null {
  // The schema explicitly permits endTime "24:00" for midnight-ending shifts.
  if (value === '24:00') return 24 * 60
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) return null
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

/** Convert a DATE key plus Bangkok wall-clock times into the actual UTC end. */
export function assignmentEndInstant(assignment: AssignmentTiming): Date | null {
  if (!Number.isFinite(assignment.date.getTime())) return null
  const start = clockMinutes(assignment.startTime)
  let end = clockMinutes(assignment.endTime)
  if (start === null || end === null) return null
  // 01:00–05:00 ends that morning; 23:00–05:00 ends the following morning.
  // 24:00 already means the next midnight and must not be rolled a second time.
  if (end <= start) end += 24 * 60
  return new Date(addAssignmentDays(assignment.date, 0).getTime() + end * 60 * 1000 - BANGKOK_OFFSET_MS)
}

export function assignmentHasEnded(assignment: AssignmentTiming, now: Date): boolean {
  const end = assignmentEndInstant(assignment)
  return end !== null && end.getTime() <= now.getTime()
}

export function upcomingAssignments<T extends AssignmentTiming>(assignments: readonly T[], now: Date): T[] {
  return assignments.filter(assignment => {
    const end = assignmentEndInstant(assignment)
    return end !== null && end.getTime() > now.getTime()
  })
}
