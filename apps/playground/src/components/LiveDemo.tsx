import type { QuizConfig, QuizEvent } from "@quiz/core";
import { Quiz } from "@quiz/react";
import { useCallback, useMemo, useState } from "react";
import { mixedDemo } from "../quizzes/mixed-demo";
import { singleChoiceDemo } from "../quizzes/single-choice-demo";
import { EventLog } from "./EventLog";

type DemoId = "mixed" | "single";

const demos = {
  mixed: mixedDemo,
  single: singleChoiceDemo,
} as const;

export function LiveDemo() {
  const [activeDemo, setActiveDemo] = useState<DemoId>("mixed");
  const [resetKey, setResetKey] = useState(0);
  const [events, setEvents] = useState<QuizEvent[]>([]);
  const [allowBack, setAllowBack] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  const config = useMemo<QuizConfig>(
    () => ({
      allowBackNavigation: allowBack,
      shuffleQuestions,
    }),
    [allowBack, shuffleQuestions],
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
        </div>

        <div className="site-demo-layout">
          <div>
            <Quiz
              key={`${activeDemo}-${resetKey}`}
              quiz={demos[activeDemo]}
              config={config}
              onEvent={handleEvent}
            />
          </div>
          <EventLog events={events} onClear={() => setEvents([])} />
        </div>
      </div>
    </section>
  );
}
