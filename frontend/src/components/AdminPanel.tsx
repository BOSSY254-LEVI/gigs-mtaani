type AdminPanelProps = {
  metrics?: {
    totals?: Record<string, number>;
    totalUsers?: number;
    activeGigs?: number;
    completedToday?: number;
    disputes?: number;
  };
  risk?: {
    counts?: Record<string, number>;
    highRisk?: number;
    mediumRisk?: number;
    lowRisk?: number;
  };
};

export function AdminPanel({ metrics, risk }: AdminPanelProps) {
  if (!metrics && !risk) return null;

  // Transform metrics to array if needed
  const metricsData = metrics?.totals 
    ? Object.entries(metrics.totals).map(([key, value]) => ({ key, value }))
    : metrics 
      ? [
          { key: 'totalUsers', value: metrics.totalUsers ?? 0 },
          { key: 'activeGigs', value: metrics.activeGigs ?? 0 },
          { key: 'completedToday', value: metrics.completedToday ?? 0 },
          { key: 'disputes', value: metrics.disputes ?? 0 }
        ]
      : [];

  // Transform risk to array if needed
  const riskData = risk?.counts
    ? Object.entries(risk.counts).map(([key, value]) => ({ key: `${key} risk`, value }))
    : risk
      ? [
          { key: 'highRisk', value: risk.highRisk ?? 0 },
          { key: 'mediumRisk', value: risk.mediumRisk ?? 0 },
          { key: 'lowRisk', value: risk.lowRisk ?? 0 }
        ]
      : [];

  return (
    <section className="panel">
      <h3>Ops Dashboard</h3>
      {metricsData.length > 0 ? (
        <div className="kpi-grid">
          {metricsData.map((item) => (
            <article className="kpi-card" key={item.key}>
              <p>{item.key}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      ) : null}
      {riskData.length > 0 ? (
        <div className="kpi-grid">
          {riskData.map((item) => (
            <article className="kpi-card" key={item.key}>
              <p>{item.key}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
