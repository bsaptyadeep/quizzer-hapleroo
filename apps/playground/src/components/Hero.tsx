import { INSTALL_COMMAND } from "../content/codeExamples";
import { CopyButton } from "./CopyButton";

export function Hero() {
  return (
    <section className="site-hero">
      <div className="site-container site-hero-inner">
        <div className="site-hero-badge">
          <span className="site-hero-badge-dot" aria-hidden="true" />
          Framework-agnostic quiz engine + React UI
        </div>

        <h1 className="site-hero-title">
          Build quizzes
          <br />
          <span className="site-hero-title-accent">in minutes</span>
        </h1>

        <p className="site-hero-subtitle">
          Typed quiz definitions, a headless state machine, and a polished React component.
          Install, pass JSON, customize with CSS variables.
        </p>

        <div className="site-install">
          <code>{INSTALL_COMMAND}</code>
          <CopyButton text={INSTALL_COMMAND} />
        </div>

        <div className="site-hero-actions">
          <a href="#demo" className="site-btn site-btn-primary">
            Live demo
          </a>
          <a href="#docs" className="site-btn">
            Read docs
          </a>
        </div>
      </div>
    </section>
  );
}
