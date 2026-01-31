import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles for calendar grid layout
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: 15,
    borderBottom: '2px solid #2f6364',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f6364',
  },
  subtitle: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
  },
  calendar: {
    display: 'flex',
    flexDirection: 'column',
  },
  dayHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#2f6364',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  dayHeader: {
    flex: 1,
    paddingVertical: 8,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  weekRow: {
    flexDirection: 'row',
    height: 75,
    borderBottom: '1px solid #e5e7eb',
  },
  dayCell: {
    flex: 1,
    padding: 6,
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  dayCellEmpty: {
    flex: 1,
    padding: 6,
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#fafafa',
  },
  dayCellWeekend: {
    flex: 1,
    padding: 6,
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#f8f9fa',
  },
  dayCellToday: {
    flex: 1,
    padding: 6,
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#e0f7fa',
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'right',
    marginBottom: 4,
  },
  dateNumberWeekend: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
    textAlign: 'right',
    marginBottom: 4,
  },
  djName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2f6364',
    textAlign: 'center',
    marginTop: 6,
  },
  djTime: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    marginTop: 2,
  },
  specialEvent: {
    fontSize: 9,
    color: '#a47764',
    textAlign: 'center',
    marginTop: 6,
  },
  emptySlot: {
    fontSize: 9,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 8,
    marginTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: '#999999',
  },
  brandText: {
    fontSize: 9,
    color: '#00bbe4',
    fontWeight: 'bold',
  },
});

interface VenueColumn {
  venue: { id: string; name: string };
  slot: string | null;
  label: string;
}

interface Assignment {
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
  specialEvent?: string | null;
  venue: { id: string; name: string };
  artist: { stageName: string } | null;
}

interface SchedulePDFProps {
  month: number;
  year: number;
  venueColumns: VenueColumn[];
  assignments: Assignment[];
  generatedAt: string;
}

// Helper: Generate calendar weeks for the month (Mon-Sun format)
function getCalendarWeeks(year: number, month: number): (Date | null)[][] {
  const weeks: (Date | null)[][] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const totalDays = lastDay.getDate();

  // Get day of week (0 = Sun, convert to Mon = 0)
  let startDayOfWeek = firstDay.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Convert to Mon=0, Sun=6

  let currentWeek: (Date | null)[] = [];

  // Pad the first week with nulls
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= totalDays; day++) {
    currentWeek.push(new Date(year, month - 1, day));

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad the last week with nulls
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function SchedulePDF({
  month,
  year,
  venueColumns,
  assignments,
  generatedAt,
}: SchedulePDFProps) {
  // Generate calendar weeks
  const weeks = getCalendarWeeks(year, month);
  const totalPages = venueColumns.length;

  // Create assignment lookup map (use local timezone)
  const assignmentMap = new Map<string, Assignment>();
  assignments.forEach((assignment) => {
    const d = new Date(assignment.date);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const key = `${dateStr}-${assignment.venue.id}-${assignment.slot || 'main'}`;
    assignmentMap.set(key, assignment);
  });

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Document>
      {venueColumns.map((venueCol, pageIndex) => (
        <Page
          key={`${venueCol.venue.id}-${venueCol.slot || 'main'}`}
          size="A4"
          orientation="landscape"
          style={styles.page}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{venueCol.label}</Text>
            <Text style={styles.subtitle}>
              {monthName} • Bright Ears Entertainment
            </Text>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendar}>
            {/* Day headers */}
            <View style={styles.dayHeaderRow}>
              {DAY_NAMES.map((dayName) => (
                <Text key={dayName} style={styles.dayHeader}>
                  {dayName}
                </Text>
              ))}
            </View>

            {/* Week rows */}
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => {
                  // Empty cell for days outside month
                  if (!day) {
                    return (
                      <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.dayCellEmpty} />
                    );
                  }

                  const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                  const assignmentKey = `${dateStr}-${venueCol.venue.id}-${venueCol.slot || 'main'}`;
                  const assignment = assignmentMap.get(assignmentKey);

                  const isWeekend = dayIndex >= 5; // Sat, Sun
                  const isToday = day.toDateString() === today.toDateString();

                  // Determine cell style
                  let cellStyle = styles.dayCell;
                  if (isToday) {
                    cellStyle = styles.dayCellToday;
                  } else if (isWeekend) {
                    cellStyle = styles.dayCellWeekend;
                  }

                  return (
                    <View key={dateStr} style={cellStyle}>
                      <Text style={isWeekend ? styles.dateNumberWeekend : styles.dateNumber}>
                        {day.getDate()}
                      </Text>
                      {assignment ? (
                        <>
                          {assignment.artist ? (
                            <>
                              <Text style={styles.djName}>
                                {assignment.artist.stageName}
                              </Text>
                              <Text style={styles.djTime}>
                                {assignment.startTime}-{assignment.endTime}
                              </Text>
                            </>
                          ) : assignment.specialEvent ? (
                            <Text style={styles.specialEvent}>
                              {assignment.specialEvent}
                            </Text>
                          ) : (
                            <Text style={styles.emptySlot}>-</Text>
                          )}
                        </>
                      ) : (
                        <Text style={styles.emptySlot}>-</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Page {pageIndex + 1} of {totalPages} • Generated {generatedAt}
            </Text>
            <Text style={styles.brandText}>Bright Ears</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
