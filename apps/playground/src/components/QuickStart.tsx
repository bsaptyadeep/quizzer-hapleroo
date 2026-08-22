import { QUICK_START_STEPS } from "../content/codeExamples";
import { CodeBlock } from "./CodeBlock";

export function QuickStart() {
  return (
    <section className="site-section">
      <div className="site-container">
        <header className="site-section-header">
          <span className="site-section-label">Get started</span>
          <h2 className="site-section-title">Quick start</h2>
          <p className="site-section-desc">
            Three steps from install to a working quiz in your React app.
          </p>
        </header>

        <div className="site-steps">
          {QUICK_START_STEPS.map((step, index) => (
            <article key={step.title} className="site-step">
              <div className="site-step-num">{index + 1}</div>
              <h3 className="site-step-title">{step.title}</h3>
              <p className="site-step-desc">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="site-mt-lg">
          <CodeBlock
            code={`${QUICK_START_STEPS[0].code}\n\nimport { Quiz } from "hapleroo-quizzard";\n${QUICK_START_STEPS[1].code}\n\n${QUICK_START_STEPS[2].code}`}
            language="tsx"
          />
        </div>
      </div>
    </section>
  );
}
