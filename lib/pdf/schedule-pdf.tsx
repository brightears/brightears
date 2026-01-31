import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts (using system fonts for simplicity)
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
    fontSize: 9,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #2f6364',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f6364',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    minHeight: 35,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#2f6364',
    minHeight: 30,
  },
  dateCell: {
    width: '12%',
    padding: 5,
    borderRight: '1px solid #e5e7eb',
    justifyContent: 'center',
  },
  dateHeaderCell: {
    width: '12%',
    padding: 5,
    borderRight: '1px solid rgba(255,255,255,0.2)',
    justifyContent: 'center',
  },
  venueCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid #e5e7eb',
    justifyContent: 'center',
  },
  venueHeaderCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid rgba(255,255,255,0.2)',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 8,
    textAlign: 'center',
  },
  dateNum: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  dayName: {
    fontSize: 7,
    color: '#666666',
    textAlign: 'center',
  },
  djName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2f6364',
    textAlign: 'center',
  },
  djTime: {
    fontSize: 7,
    color: '#666666',
    textAlign: 'center',
    marginTop: 2,
  },
  emptySlot: {
    fontSize: 7,
    color: '#999999',
    textAlign: 'center',
  },
  todayRow: {
    backgroundColor: '#e0f7fa',
  },
  weekendRow: {
    backgroundColor: '#f5f5f5',
  },
  pastRow: {
    opacity: 0.6,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
  },
  brandText: {
    fontSize: 8,
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

export function SchedulePDF({
  month,
  year,
  venueColumns,
  assignments,
  generatedAt,
}: SchedulePDFProps) {
  // Generate days of the month
  const daysInMonth: Date[] = [];
  const lastDay = new Date(year, month, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    daysInMonth.push(new Date(year, month - 1, i));
  }

  // Create assignment lookup (use local timezone to match calendar days)
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
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DJ Schedule - {monthName}</Text>
          <Text style={styles.subtitle}>
            Bright Ears Entertainment • Generated {generatedAt}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.dateHeaderCell}>
              <Text style={styles.headerText}>Date</Text>
            </View>
            {venueColumns.map((col, i) => (
              <View key={i} style={styles.venueHeaderCell}>
                <Text style={styles.headerText}>{col.label}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {daysInMonth.map((day) => {
            const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = day.getDate();
            const isPast = day < today;
            const isToday = day.toDateString() === today.toDateString();
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            // Combine styles for the row
            const rowStyles = {
              ...styles.tableRow,
              ...(isToday ? styles.todayRow : isWeekend ? styles.weekendRow : {}),
              ...(isPast ? styles.pastRow : {}),
            };

            return (
              <View key={dateStr} style={rowStyles}>
                <View style={styles.dateCell}>
                  <Text style={styles.dateNum}>{dayNum}</Text>
                  <Text style={styles.dayName}>{dayOfWeek}</Text>
                </View>
                {venueColumns.map((col, i) => {
                  const key = `${dateStr}-${col.venue.id}-${col.slot || 'main'}`;
                  const assignment = assignmentMap.get(key);

                  return (
                    <View key={i} style={styles.venueCell}>
                      {assignment ? (
                        <>
                          <Text style={styles.djName}>
                            {assignment.artist?.stageName || assignment.specialEvent || 'No DJ'}
                          </Text>
                          <Text style={styles.djTime}>
                            {assignment.startTime}-{assignment.endTime}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.emptySlot}>-</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Page 1 of 1 • {daysInMonth.length} days
          </Text>
          <Text style={styles.brandText}>Bright Ears</Text>
        </View>
      </Page>
    </Document>
  );
}
