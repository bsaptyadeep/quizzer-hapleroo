import { describe, expect, it, vi } from "vitest";
import type { QuizEvent } from "../types/events";
import type { QuizStatus } from "../types/quiz-state";
import { validMixedQuiz } from "../validation/fixtures/valid-quiz";
import { createQuizEngine } from "./create-quiz-engine";
import { completeMixedQuiz, mixedQuizAllCorrect } from "./fixtures/engine-scenarios";

describe("createQuizEngine", () => {
  it("starts in not_started status", () => {
    const engine = createQuizEngine(validMixedQuiz);

    expect(engine.getState().status).toBe("not_started");
    expect(engine.getResult()).toBeNull();
  });

  it("start transitions to in_progress and emits quiz:started", () => {
    const engine = createQuizEngine(validMixedQuiz);
    const events: QuizEvent[] = [];
    engine.subscribe((event) => events.push(event));

    engine.start();

    expect(engine.getState().status).toBe("in_progress");
    expect(engine.getState().startedAt).not.toBeNull();
    expect(events.map((event) => event.type)).toEqual([
      "quiz:started",
      "question:viewed",
    ]);
  });

  it("completes a full mixed quiz flow", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    const result = completeMixedQuiz(engine);

    expect(engine.getState().status).toBe("completed");
    expect(result).toMatchObject({
      quizId: "mixed-quiz",
      score: 3,
      maxScore: 3,
      percentage: 100,
    });
    expect(engine.getResult()).toEqual(result);
  });

  it("restart resets state and clears result", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();
    completeMixedQuiz(engine);

    const events: QuizEvent[] = [];
    engine.subscribe((event) => events.push(event));
    engine.restart();

    expect(engine.getState().status).toBe("not_started");
    expect(engine.getResult()).toBeNull();
    expect(events.some((event) => event.type === "quiz:restarted")).toBe(true);
  });

  it("throws when submitting before requirements are met", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    expect(() => engine.submit()).toThrow(
      "Cannot submit the quiz until all requirements are met.",
    );
  });

  it("throws when answering unknown question id", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    expect(() =>
      engine.answer("missing", {
        type: "single-choice",
        selectedOptionId: "a",
      }),
    ).toThrow('Unknown question id "missing".');
  });
});

describe("navigation", () => {
  it("blocks next when requireAnswerToProceed is true and unanswered", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    expect(engine.canGoNext()).toBe(false);

    engine.next();
    expect(engine.getState().currentQuestionIndex).toBe(0);
  });

  it("allows next without answer when requireAnswerToProceed is false", () => {
    const engine = createQuizEngine(validMixedQuiz, {
      requireAnswerToProceed: false,
    });
    engine.start();

    expect(engine.canGoNext()).toBe(true);
    engine.next();
    expect(engine.getState().currentQuestionIndex).toBe(1);
  });

  it("blocks previous when allowBackNavigation is false", () => {
    const engine = createQuizEngine(validMixedQuiz, {
      allowBackNavigation: false,
    });
    engine.start();
    engine.answer("q1", { type: "single-choice", selectedOptionId: "b" });
    engine.next();

    expect(engine.canGoPrevious()).toBe(false);
    engine.previous();
    expect(engine.getState().currentQuestionIndex).toBe(1);
  });

  it("canSubmit is true only on last question when all answered", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    expect(engine.canSubmit()).toBe(false);

    engine.answer("q1", { type: "single-choice", selectedOptionId: "b" });
    engine.next();
    engine.answer("q2", { type: "multiple-choice", selectedOptionIds: ["a", "c"] });
    engine.next();
    engine.answer("q3", { type: "single-choice", selectedOptionId: "b" });

    expect(engine.canSubmit()).toBe(true);
  });

  it("next is a no-op on the last question", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    engine.answer("q1", { type: "single-choice", selectedOptionId: "b" });
    engine.next();
    engine.answer("q2", { type: "multiple-choice", selectedOptionIds: ["a", "c"] });
    engine.next();
    engine.answer("q3", { type: "single-choice", selectedOptionId: "b" });

    const index = engine.getState().currentQuestionIndex;
    engine.next();
    expect(engine.getState().currentQuestionIndex).toBe(index);
  });
});

describe("answers", () => {
  it("replaces single-choice answers", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    engine.answer("q1", { type: "single-choice", selectedOptionId: "a" });
    engine.answer("q1", { type: "single-choice", selectedOptionId: "b" });

    expect(engine.getState().answers.q1).toEqual({
      type: "single-choice",
      selectedOptionId: "b",
    });
  });

  it("stores full multiple-choice selection arrays", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();
    engine.next();

    engine.answer("q2", { type: "multiple-choice", selectedOptionIds: ["a"] });
    engine.answer("q2", { type: "multiple-choice", selectedOptionIds: ["a", "c"] });

    expect(engine.getState().answers.q2).toEqual({
      type: "multiple-choice",
      selectedOptionIds: ["a", "c"],
    });
  });

  it("emits question:answered with isComplete", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    const events: QuizEvent[] = [];
    engine.subscribe((event) => events.push(event));

    engine.answer("q1", { type: "single-choice", selectedOptionId: "b" });

    const answeredEvent = events.find((event) => event.type === "question:answered");
    expect(answeredEvent).toMatchObject({
      type: "question:answered",
      payload: {
        questionId: "q1",
        isComplete: true,
      },
    });
  });
});

describe("events and state subscriptions", () => {
  it("delivers ordered events through a full quiz flow", () => {
    const engine = createQuizEngine(validMixedQuiz);
    const events: QuizEvent[] = [];
    engine.subscribe((event) => events.push(event));

    engine.start();
    completeMixedQuiz(engine);

    expect(events.some((event) => event.type === "quiz:completed")).toBe(true);
    expect(events.some((event) => event.type === "answer:selected")).toBe(true);
    expect(events.some((event) => event.type === "navigation:next")).toBe(true);
  });

  it("supports unsubscribing from events", () => {
    const engine = createQuizEngine(validMixedQuiz);
    const listener = vi.fn();
    const unsubscribe = engine.subscribe(listener);

    unsubscribe();
    engine.start();

    expect(listener).not.toHaveBeenCalled();
  });

  it("notifies state subscribers on transitions", () => {
    const engine = createQuizEngine(validMixedQuiz);
    const states: QuizStatus[] = [];
    engine.subscribeToState((state) => states.push(state.status));

    engine.start();

    expect(states).toContain("in_progress");
  });

  it("quiz:completed includes result payload", () => {
    const engine = createQuizEngine(validMixedQuiz);
    const events: QuizEvent[] = [];
    engine.subscribe((event) => events.push(event));

    engine.start();
    completeMixedQuiz(engine);

    const completed = events.find((event) => event.type === "quiz:completed");
    expect(completed?.type).toBe("quiz:completed");
    if (completed?.type === "quiz:completed") {
      expect(completed.payload.result.percentage).toBe(100);
    }
  });
});

describe("shuffle and config", () => {
  it("shuffles question order when configured", () => {
    let counter = 0;
    const random = () => {
      const values = [0.9, 0.1, 0.5];
      return values[counter++ % values.length];
    };

    const engine = createQuizEngine(
      validMixedQuiz,
      { shuffleQuestions: true },
      { random },
    );

    engine.start();

    expect(engine.getState().questionOrder).not.toEqual(["q1", "q2", "q3"]);
    expect(new Set(engine.getState().questionOrder)).toEqual(
      new Set(["q1", "q2", "q3"]),
    );
  });

  it("shuffles option order when configured", () => {
    let counter = 0;
    const random = () => {
      const values = [0.9, 0.2, 0.8, 0.1, 0.5, 0.4];
      return values[counter++ % values.length];
    };

    const engine = createQuizEngine(
      validMixedQuiz,
      { shuffleOptions: true },
      { random },
    );

    engine.start();

    expect(engine.getState().optionOrder.q1).not.toEqual(["a", "b", "c"]);
    expect(new Set(engine.getState().optionOrder.q1)).toEqual(
      new Set(["a", "b", "c"]),
    );
  });

  it("uses custom pointsPerQuestion in submit result", () => {
    const engine = createQuizEngine(validMixedQuiz, {
      pointsPerQuestion: 2,
    });
    engine.start();

    const result = completeMixedQuiz(engine);

    expect(result).toMatchObject({
      score: 6,
      maxScore: 6,
    });
  });

  it("evaluates questions in shuffled questionOrder", () => {
    let counter = 0;
    const random = () => {
      const values = [0.95, 0.05, 0.5];
      return values[counter++ % values.length];
    };

    const engine = createQuizEngine(
      validMixedQuiz,
      { shuffleQuestions: true },
      { random },
    );

    engine.start();

    for (const [questionId, answer] of Object.entries(mixedQuizAllCorrect())) {
      engine.answer(questionId, answer);
    }

    engine.goTo(engine.getState().questionOrder.length - 1);
    const result = engine.submit();
    expect(result.questionResults.map((entry) => entry.questionId)).toEqual(
      engine.getState().questionOrder,
    );
  });
});

describe("goTo", () => {
  it("jumps to a clamped question index and emits question:viewed", () => {
    const engine = createQuizEngine(validMixedQuiz);
    engine.start();

    const events: QuizEvent[] = [];
    engine.subscribe((event) => events.push(event));

    engine.goTo(2);

    expect(engine.getState().currentQuestionIndex).toBe(2);
    expect(events.at(-1)?.type).toBe("question:viewed");
  });
});

describe("createQuizEngine validation", () => {
  it("throws QuizValidationError for invalid quiz definitions", () => {
    expect(() => createQuizEngine({} as never)).toThrow();
  });
});
