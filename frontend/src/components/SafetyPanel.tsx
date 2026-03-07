type SafetyPanelProps = {
  sessions: Array<{
    id: string;
    status: "ACTIVE" | "ESCALATED" | "ENDED";
    startedAt: string;
    lastCheckInAt?: string;
  }>;
  onSos: (sessionId: string) => Promise<void>;
};

export function SafetyPanel({ sessions, onSos }: SafetyPanelProps) {
  return (
    <section className="panel">
      <h3>Safety Console</h3>
      {!sessions.length ? <p className="muted">No active safety sessions.</p> : null}
      {sessions.map((session) => (
        <article key={session.id} className="safety-card">
          <div>
            <strong>{session.status}</strong>
            <p>Started {new Date(session.startedAt).toLocaleString()}</p>
            <small>Last check-in {session.lastCheckInAt ? new Date(session.lastCheckInAt).toLocaleTimeString() : "N/A"}</small>
          </div>
          <button className="danger" onClick={() => onSos(session.id)}>SOS</button>
        </article>
      ))}
    </section>
  );
}

