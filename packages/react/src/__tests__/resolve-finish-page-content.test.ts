import { describe, expect, it } from "vitest";
import type { QuizResult } from "hapleroo-quizzard-core";
import {
  DEFAULT_FINISH_PAGE_TIERS,
  resolveFinishPageContent,
} from "../utils/resolve-finish-page-content";

function makeResult(percentage: number): QuizResult {
  const score = Math.round((percentage / 100) * 4);
  return {
    quizId: "test",
    score,
    maxScore: 4,
    percentage,
    questionResults: [],
    startedAt: 0,
    completedAt: 60000,
    durationMs: 60000,
  };
}

describe("resolveFinishPageContent", () => {
  it("matches perfect tier at 100%", () => {
    const content = resolveFinishPageContent(undefined, makeResult(100));
    expect(content.title).toBe("Perfect score!");
    expect(content.subtitle).toBe("You nailed every question.");
  });

  it("matches great tier at 85%", () => {
    const content = resolveFinishPageContent(undefined, makeResult(85));
    expect(content.title).toBe("Great job!");
  });

  it("matches good effort tier at 79%", () => {
    const content = resolveFinishPageContent(undefined, makeResult(79));
    expect(content.title).toBe("Good effort");
  });

  it("matches keep practicing tier at 0%", () => {
    const content = resolveFinishPageContent(undefined, makeResult(0));
    expect(content.title).toBe("Keep practicing");
  });

  it("uses explicit title override", () => {
    const content = resolveFinishPageContent(
      { title: "Custom headline!" },
      makeResult(100),
    );
    expect(content.title).toBe("Custom headline!");
  });

  it("supports function title", () => {
    const content = resolveFinishPageContent(
      { title: (result) => `You got ${result.percentage}%` },
      makeResult(75),
    );
    expect(content.title).toBe("You got 75%");
  });

  it("uses custom tiers when provided", () => {
    const content = resolveFinishPageContent(
      {
        tiers: [{ minPercentage: 0, title: "Thanks for playing!" }],
      },
      makeResult(50),
    );
    expect(content.title).toBe("Thanks for playing!");
  });

  it("exports default tiers sorted high to low", () => {
    expect(DEFAULT_FINISH_PAGE_TIERS[0]?.minPercentage).toBe(100);
  });
});
