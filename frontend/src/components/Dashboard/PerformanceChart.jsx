const SPORT_COLORS = {
  Football: '#3b82f6',
  Basketball: '#f59e0b',
  Swimming: '#06b6d4',
  Athletics: '#10b981',
  Tennis: '#8b5cf6',
  Cricket: '#ef4444',
  Other: '#64748b',
};

export default function PerformanceChart({ athletes }) {
  if (!athletes.length) return null;

  // Sport distribution for bar chart
  const sportCount = athletes.reduce((acc, a) => {
    acc[a.sport] = (acc[a.sport] || 0) + 1;
    return acc;
  }, {});
  const sports = Object.entries(sportCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCount = Math.max(...sports.map(s => s[1]));

  // Performance score distribution
  const scoreGroups = [
    { label: '0-20', count: athletes.filter(a => a.performanceScore <= 20).length },
    { label: '21-40', count: athletes.filter(a => a.performanceScore > 20 && a.performanceScore <= 40).length },
    { label: '41-60', count: athletes.filter(a => a.performanceScore > 40 && a.performanceScore <= 60).length },
    { label: '61-80', count: athletes.filter(a => a.performanceScore > 60 && a.performanceScore <= 80).length },
    { label: '81-100', count: athletes.filter(a => a.performanceScore > 80).length },
  ];
  const maxScoreCount = Math.max(...scoreGroups.map(g => g.count), 1);

  // Status distribution
  const statusCount = {
    Active: athletes.filter(a => a.status === 'Active').length,
    Injured: athletes.filter(a => a.status === 'Injured').length,
    Resting: athletes.filter(a => a.status === 'Resting').length,
  };
  const total = athletes.length;

  return (
    <div className="charts-grid">
      {/* Sport Distribution */}
      <div className="chart-card">
        <h3 className="chart-title">Athletes by Sport</h3>
        <div className="bar-chart">
          {sports.map(([sport, count]) => (
            <div key={sport} className="bar-row">
              <span className="bar-label">{sport}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    background: SPORT_COLORS[sport] || SPORT_COLORS.Other
                  }}
                />
              </div>
              <span className="bar-value">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Score Distribution */}
      <div className="chart-card">
        <h3 className="chart-title">Performance Score Range</h3>
        <div className="column-chart">
          {scoreGroups.map(({ label, count }) => (
            <div key={label} className="column-item">
              <div className="column-track">
                <div
                  className="column-fill"
                  style={{ height: `${(count / maxScoreCount) * 100}%` }}
                />
              </div>
              <span className="column-label">{label}</span>
              <span className="column-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Donut */}
      <div className="chart-card">
        <h3 className="chart-title">Status Overview</h3>
        <div className="status-chart">
          {Object.entries(statusCount).map(([status, count]) => {
            const pct = total ? Math.round((count / total) * 100) : 0;
            const colors = { Active: '#10b981', Injured: '#ef4444', Resting: '#f59e0b' };
            return (
              <div key={status} className="status-row">
                <div className="status-dot" style={{ background: colors[status] }} />
                <span className="status-name">{status}</span>
                <div className="status-bar-track">
                  <div
                    className="status-bar-fill"
                    style={{ width: `${pct}%`, background: colors[status] }}
                  />
                </div>
                <span className="status-pct">{pct}%</span>
                <span className="status-count">({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
