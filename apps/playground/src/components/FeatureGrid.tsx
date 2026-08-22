const FEATURES = [
  {
    icon: "⚡",
    title: "Headless core",
    description:
      "Framework-agnostic engine with validation, scoring, and a predictable state machine.",
  },
  {
    icon: "⚛️",
    title: "Drop-in React UI",
    description:
      "Ship quizzes fast with <Quiz /> or build custom UI with the useQuizEngine hook.",
  },
  {
    icon: "📡",
    title: "Typed events",
    description:
      "Subscribe to quiz:started, answer:selected, navigation events, and more.",
  },
  {
    icon: "🎨",
    title: "CSS theming",
    description:
      "Override --quiz-color-* variables on a wrapper class. No runtime theme API needed.",
  },
] as const;

export function FeatureGrid() {
  return (
    <section className="site-section">
      <div className="site-container">
        <div className="site-features-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="site-feature-card">
              <div className="site-feature-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="site-feature-title">{feature.title}</h3>
              <p className="site-feature-desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
