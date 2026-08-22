import type { QuizEvent } from "@quiz/core";

interface EventLogProps {
  events: QuizEvent[];
  onClear: () => void;
}

function formatPayload(event: QuizEvent): string {
  try {
    return JSON.stringify(event.payload, null, 0);
  } catch {
    return String(event.payload);
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}

export function EventLog({ events, onClear }: EventLogProps) {
  return (
    <aside className="site-card site-event-log">
      <div className="site-card-body">
        <div className="site-event-log-header">
          <h3 className="site-event-log-title">Event log</h3>
          <div className="site-event-log-actions">
            <span className="site-event-log-count">{events.length} events</span>
            {events.length > 0 && (
              <button type="button" className="site-btn site-btn-sm site-btn-ghost" onClick={onClear}>
                Clear
              </button>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <p className="site-event-empty">Interact with the quiz to see events stream here.</p>
        ) : (
          <ul className="site-event-list">
            {[...events].reverse().map((event, index) => (
              <li key={`${event.type}-${event.timestamp}-${index}`} className="site-event-item">
                <span className="site-event-time">{formatTime(event.timestamp)}</span>
                <span className="site-event-type">{event.type}</span>
                <p className="site-event-payload">{formatPayload(event)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
