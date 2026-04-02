/**
 * Venue Performance Report — HTML Template
 * Generates a clean, professional HTML report for venue managers
 * showing DJ performance analytics for a given month.
 */

export interface DJBreakdown {
  stageName: string;
  shifts: number;
  hours: number;
  avgRating: number;
  prevAvgRating: number | null;
}

export interface RatingDistribution {
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
  total: number;
}

export interface DayOfWeekData {
  day: string;
  performanceCount: number;
  avgCrowdMetric: number | null; // null if no VenueNightFeedback
  avgHeadcount: number | null;
}

export interface Recommendation {
  type: 'positive' | 'warning' | 'info';
  message: string;
}

export interface VenuePerformanceData {
  venueName: string;
  month: string; // "March 2026"
  monthKey: string; // "2026-03"

  // Summary
  totalPerformances: number;
  totalHours: number;
  avgRating: number;
  prevAvgRating: number | null;

  // DJ Breakdown
  djBreakdown: DJBreakdown[];

  // Rating Distribution
  ratingDistribution: RatingDistribution;

  // Top Performer
  topPerformer: {
    stageName: string;
    avgRating: number;
    shifts: number;
  } | null;

  // Day of Week
  dayOfWeek: DayOfWeekData[];

  // Recommendations
  recommendations: Recommendation[];

  generatedAt: string;
}

function trendArrow(current: number, previous: number | null): string {
  if (previous === null) return '';
  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return '<span style="color:#888;">&#8212;</span>'; // em dash
  if (diff > 0) return `<span style="color:#22c55e;">&#9650; ${diff.toFixed(1)}</span>`;
  return `<span style="color:#ef4444;">&#9660; ${Math.abs(diff).toFixed(1)}</span>`;
}

function pct(count: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((count / total) * 100)}%`;
}

function ratingBar(count: number, total: number): string {
  const width = total === 0 ? 0 : Math.round((count / total) * 100);
  return `<div style="display:flex;align-items:center;gap:8px;">
    <div style="width:120px;height:12px;background:#e5e7eb;border-radius:6px;overflow:hidden;">
      <div style="width:${width}%;height:100%;background:#f59e0b;border-radius:6px;"></div>
    </div>
    <span style="font-size:13px;color:#555;">${count} (${pct(count, total)})</span>
  </div>`;
}

function recIcon(type: string): string {
  if (type === 'positive') return '&#9733;'; // star
  if (type === 'warning') return '&#9888;'; // warning
  return '&#8505;'; // info
}

function recColor(type: string): string {
  if (type === 'positive') return '#22c55e';
  if (type === 'warning') return '#ef4444';
  return '#3b82f6';
}

export function renderVenuePerformanceHTML(data: VenuePerformanceData): string {
  const djRows = data.djBreakdown.map((dj) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500;">${dj.stageName}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${dj.shifts}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${dj.hours.toFixed(1)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${dj.avgRating.toFixed(1)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${trendArrow(dj.avgRating, dj.prevAvgRating)}</td>
    </tr>
  `).join('');

  const dayRows = data.dayOfWeek.map((d) => `
    <tr>
      <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${d.day}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.performanceCount}</td>
      ${d.avgHeadcount !== null
        ? `<td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.avgHeadcount}</td>`
        : ''}
      ${d.avgCrowdMetric !== null
        ? `<td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.avgCrowdMetric.toFixed(1)}</td>`
        : ''}
    </tr>
  `).join('');

  const hasCrowdData = data.dayOfWeek.some((d) => d.avgCrowdMetric !== null);

  const recItems = data.recommendations.map((r) => `
    <div style="padding:10px 14px;margin-bottom:8px;border-left:4px solid ${recColor(r.type)};background:#f9fafb;border-radius:4px;font-size:14px;">
      <span style="color:${recColor(r.type)};margin-right:6px;">${recIcon(r.type)}</span>
      ${r.message}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Venue Performance Report — ${data.venueName} — ${data.month}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 32px; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    h2 { font-size: 18px; font-weight: 600; margin-top: 32px; margin-bottom: 12px; color: #111827; border-bottom: 2px solid #f59e0b; padding-bottom: 6px; }
    .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
    .brand { color: #f59e0b; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 8px; }
    .stat-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 700; color: #111827; }
    .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    thead th { padding: 10px 12px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.3px; color: #6b7280; }
    .top-performer { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; display: flex; align-items: center; gap: 16px; }
    .top-performer .trophy { font-size: 32px; }
    .top-performer .name { font-size: 18px; font-weight: 700; }
    .top-performer .stats { font-size: 13px; color: #6b7280; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
    @media print { .container { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <h1><span class="brand">BrightEars</span> Venue Performance Report</h1>
    <div class="subtitle">${data.venueName} &mdash; ${data.month}</div>

    <!-- Monthly Summary -->
    <h2>Monthly Summary</h2>
    <div class="summary-grid">
      <div class="stat-card">
        <div class="stat-value">${data.totalPerformances}</div>
        <div class="stat-label">Total Performances</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.totalHours.toFixed(1)}</div>
        <div class="stat-label">Total Hours</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.avgRating.toFixed(1)} ${trendArrow(data.avgRating, data.prevAvgRating)}</div>
        <div class="stat-label">Average Rating</div>
      </div>
    </div>

    <!-- DJ Breakdown -->
    <h2>DJ Breakdown</h2>
    ${data.djBreakdown.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>DJ</th>
          <th style="text-align:center;">Shifts</th>
          <th style="text-align:center;">Hours</th>
          <th style="text-align:center;">Avg Rating</th>
          <th style="text-align:center;">Trend</th>
        </tr>
      </thead>
      <tbody>${djRows}</tbody>
    </table>
    ` : '<p style="color:#6b7280;font-size:14px;">No DJ performances recorded this month.</p>'}

    <!-- Rating Distribution -->
    <h2>Rating Distribution</h2>
    ${data.ratingDistribution.total > 0 ? `
    <table>
      <tbody>
        <tr><td style="padding:6px 12px;width:60px;">5 &#9733;</td><td>${ratingBar(data.ratingDistribution.star5, data.ratingDistribution.total)}</td></tr>
        <tr><td style="padding:6px 12px;">4 &#9733;</td><td>${ratingBar(data.ratingDistribution.star4, data.ratingDistribution.total)}</td></tr>
        <tr><td style="padding:6px 12px;">3 &#9733;</td><td>${ratingBar(data.ratingDistribution.star3, data.ratingDistribution.total)}</td></tr>
        <tr><td style="padding:6px 12px;">2 &#9733;</td><td>${ratingBar(data.ratingDistribution.star2, data.ratingDistribution.total)}</td></tr>
        <tr><td style="padding:6px 12px;">1 &#9733;</td><td>${ratingBar(data.ratingDistribution.star1, data.ratingDistribution.total)}</td></tr>
      </tbody>
    </table>
    ` : '<p style="color:#6b7280;font-size:14px;">No ratings submitted this month.</p>'}

    <!-- Top Performer -->
    <h2>Top Performer</h2>
    ${data.topPerformer ? `
    <div class="top-performer">
      <div class="trophy">&#127942;</div>
      <div>
        <div class="name">${data.topPerformer.stageName}</div>
        <div class="stats">${data.topPerformer.avgRating.toFixed(1)} avg rating &middot; ${data.topPerformer.shifts} shift${data.topPerformer.shifts !== 1 ? 's' : ''}</div>
      </div>
    </div>
    ` : '<p style="color:#6b7280;font-size:14px;">No rated performances this month.</p>'}

    <!-- Attendance by Day of Week -->
    <h2>Activity by Day of Week</h2>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th style="text-align:center;">Performances</th>
          ${hasCrowdData ? '<th style="text-align:center;">Avg Headcount</th><th style="text-align:center;">Avg Night Rating</th>' : ''}
        </tr>
      </thead>
      <tbody>${dayRows}</tbody>
    </table>

    <!-- Recommendations -->
    ${data.recommendations.length > 0 ? `
    <h2>Recommendations</h2>
    ${recItems}
    ` : ''}

    <div class="footer">
      Generated by BrightEars &middot; ${data.generatedAt}
    </div>
  </div>
</body>
</html>`;
}
