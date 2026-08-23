import type { QuizConfig, QuizEvent } from "hapleroo-quizzard-core";
import { Quiz, type FinishPageConfig } from "hapleroo-quizzard";
import { useCallback, useMemo, useState } from "react";
import { mixedDemo } from "../quizzes/mixed-demo";
import { singleChoiceDemo } from "../quizzes/single-choice-demo";
import { EventLog } from "./EventLog";

type DemoId = "mixed" | "single";
type FinishVariant = "default" | "minimal";
type TierPreset = "default" | "strict";

const demos = {
  mixed: mixedDemo,
  single: singleChoiceDemo,
} as const;

const STRICT_TIERS = [
  { minPercentage: 100, title: "Flawless!", subtitle: "Not a single mistake." },
  { minPercentage: 70, title: "Solid work", subtitle: "Above average performance." },
  { minPercentage: 0, title: "Needs improvement", subtitle: "Study the material and retry." },
];

export function LiveDemo() {
  const [activeDemo, setActiveDemo] = useState<DemoId>("mixed");
  const [resetKey, setResetKey] = useState(0);
  const [events, setEvents] = useState<QuizEvent[]>([]);
  const [allowBack, setAllowBack] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [finishVariant, setFinishVariant] = useState<FinishVariant>("default");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [tierPreset, setTierPreset] = useState<TierPreset>("default");

  const config = useMemo<QuizConfig>(
    () => ({
      allowBackNavigation: allowBack,
      shuffleQuestions,
    }),
    [allowBack, shuffleQuestions],
  );

  const finishPage = useMemo<FinishPageConfig>(
    () => ({
      variant: finishVariant,
      showQuestionBreakdown: showBreakdown,
      tiers: tierPreset === "strict" ? STRICT_TIERS : undefined,
    }),
    [finishVariant, showBreakdown, tierPreset],
  );

  const handleEvent = useCallback((event: QuizEvent) => {
    setEvents((current) => [...current.slice(-19), event]);
  }, []);

  const handleReset = useCallback(() => {
    setEvents([]);
    setResetKey((key) => key + 1);
  }, []);

  const handleDemoChange = useCallback((demo: DemoId) => {
    setActiveDemo(demo);
    setEvents([]);
    setResetKey((key) => key + 1);
  }, []);

  return (
    <section id="demo" className="site-section">
      <div className="site-container">
        <header className="site-section-header">
          <span className="site-section-label">Interactive</span>
          <h2 className="site-section-title">Live demo</h2>
          <p className="site-section-desc">
            Try the quiz below. Switch presets, toggle config options, and watch events fire in
            real time.
          </p>
        </header>

        <div className="site-demo-controls">
          <button
            type="button"
            className={`site-btn site-btn-sm${activeDemo === "mixed" ? " is-active" : ""}`}
            onClick={() => handleDemoChange("mixed")}
          >
            Mixed quiz
          </button>
          <button
            type="button"
            className={`site-btn site-btn-sm${activeDemo === "single" ? " is-active" : ""}`}
            onClick={() => handleDemoChange("single")}
          >
            Single choice
          </button>
          <button type="button" className="site-btn site-btn-sm" onClick={handleReset}>
            Reset demo
          </button>
        </div>

        <div className="site-demo-config">
          <label className="site-toggle">
            <input
              type="checkbox"
              checked={allowBack}
              onChange={(e) => setAllowBack(e.target.checked)}
            />
            allowBackNavigation
          </label>
          <label className="site-toggle">
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
            />
            shuffleQuestions
          </label>
          <label className="site-toggle">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => {
                setAutoStart(e.target.checked);
                setResetKey((key) => key + 1);
              }}
            />
            autoStart
          </label>
          <label className="site-toggle">
            <input
              type="checkbox"
              checked={showBreakdown}
              onChange={(e) => setShowBreakdown(e.target.checked)}
            />
            showQuestionBreakdown
          </label>
        </div>

        <div className="site-demo-config">
          <span className="site-demo-config-label">Finish page:</span>
          <button
            type="button"
            className={`site-btn site-btn-sm${finishVariant === "default" ? " is-active" : ""}`}
            onClick={() => setFinishVariant("default")}
          >
            default
          </button>
          <button
            type="button"
            className={`site-btn site-btn-sm${finishVariant === "minimal" ? " is-active" : ""}`}
            onClick={() => setFinishVariant("minimal")}
          >
            minimal
          </button>
          <button
            type="button"
            className={`site-btn site-btn-sm${tierPreset === "default" ? " is-active" : ""}`}
            onClick={() => setTierPreset("default")}
          >
            encouraging tiers
          </button>
          <button
            type="button"
            className={`site-btn site-btn-sm${tierPreset === "strict" ? " is-active" : ""}`}
            onClick={() => setTierPreset("strict")}
          >
            strict tiers
          </button>
        </div>

        <div className="site-demo-layout">
          <div>
            <Quiz
              key={`${activeDemo}-${resetKey}-${autoStart}-${finishVariant}-${showBreakdown}-${tierPreset}`}
              quiz={demos[activeDemo]}
              config={config}
              autoStart={autoStart}
              finishPage={finishPage}
              onEvent={handleEvent}
            />
          </div>
          <EventLog events={events} onClear={() => setEvents([])} />
        </div>
      </div>
    </section>
  );
}
