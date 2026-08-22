import { Quiz } from "@quiz/react";
import { useState } from "react";
import { THEME_PRESETS, type ThemePresetId } from "../content/codeExamples";
import { singleChoiceDemo } from "../quizzes/single-choice-demo";
import { CodeBlock } from "./CodeBlock";

export function ThemeShowcase() {
  const [preset, setPreset] = useState<ThemePresetId>("default");
  const [resetKey, setResetKey] = useState(0);

  const activePreset = THEME_PRESETS.find((p) => p.id === preset) ?? THEME_PRESETS[0];

  return (
    <section id="theming" className="site-section">
      <div className="site-container">
        <header className="site-section-header">
          <span className="site-section-label">Customize</span>
          <h2 className="site-section-title">Theming</h2>
          <p className="site-section-desc">
            Override CSS custom properties on a wrapper class. No JavaScript theme API required.
          </p>
        </header>

        <div className="site-theme-presets">
          {THEME_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`site-btn site-btn-sm${preset === item.id ? " is-active" : ""}`}
              onClick={() => {
                setPreset(item.id);
                setResetKey((k) => k + 1);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="site-theme-layout">
          <Quiz
            key={`theme-${preset}-${resetKey}`}
            quiz={singleChoiceDemo}
            className={`my-quiz-theme ${activePreset.className}`}
            autoStart
          />
          <CodeBlock code={activePreset.css} language="css" />
        </div>
      </div>
    </section>
  );
}
