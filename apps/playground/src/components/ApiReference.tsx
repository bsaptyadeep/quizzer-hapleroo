import type { ApiRow } from "../content/apiDocs";
import {
  QUESTION_TYPES,
  QUIZ_CONFIG,
  QUIZ_DEFINITION,
  QUIZ_EVENTS,
  QUIZ_PROPS,
} from "../content/apiDocs";

function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <div className="site-table-wrap">
      <table className="site-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
                {row.required && <span className="site-api-required">*</span>}
              </td>
              <td>
                <code>{row.type}</code>
              </td>
              <td>{row.default ?? "—"}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ApiReference() {
  return (
    <section id="api" className="site-section">
      <div className="site-container">
        <header className="site-section-header">
          <span className="site-section-label">Reference</span>
          <h2 className="site-section-title">API</h2>
          <p className="site-section-desc">
            Props, configuration options, quiz schema, and event types exported from the packages.
          </p>
        </header>

        <div className="site-api-group">
          <h3 className="site-api-group-title">&lt;Quiz /&gt; props</h3>
          <ApiTable rows={QUIZ_PROPS} />
        </div>

        <div className="site-api-group">
          <h3 className="site-api-group-title">QuizConfig</h3>
          <ApiTable rows={QUIZ_CONFIG} />
        </div>

        <div className="site-api-group">
          <h3 className="site-api-group-title">QuizDefinition</h3>
          <ApiTable rows={QUIZ_DEFINITION} />
        </div>

        <div className="site-api-group">
          <h3 className="site-api-group-title">Question types</h3>
          <ApiTable rows={QUESTION_TYPES} />
        </div>

        <div className="site-api-group">
          <h3 className="site-api-group-title">QuizEvent types</h3>
          <ApiTable rows={QUIZ_EVENTS} />
        </div>
      </div>
    </section>
  );
}
