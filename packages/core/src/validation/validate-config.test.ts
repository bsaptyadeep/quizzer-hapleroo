import { describe, expect, it } from "vitest";
import { DEFAULT_QUIZ_CONFIG, resolveQuizConfig } from "../types/quiz-config";
import {
  assertValidQuizConfig,
  validateQuizConfig,
} from "./validate-config";
import { QuizValidationError } from "./errors";

describe("validateQuizConfig", () => {
  it("returns defaults when input is undefined", () => {
    const result = validateQuizConfig(undefined);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(DEFAULT_QUIZ_CONFIG);
    }
  });

  it("merges partial config with defaults via resolveQuizConfig", () => {
    const result = validateQuizConfig({
      shuffleQuestions: true,
      pointsPerQuestion: 2,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        ...DEFAULT_QUIZ_CONFIG,
        shuffleQuestions: true,
        pointsPerQuestion: 2,
      });
    }
  });

  it("accepts a fully specified valid config", () => {
    const config = {
      shuffleQuestions: true,
      shuffleOptions: true,
      allowBackNavigation: false,
      requireAnswerToProceed: false,
      showPercentage: false,
      pointsPerQuestion: 5,
    };

    const result = validateQuizConfig(config);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(config);
    }
  });

  it("rejects non-object config", () => {
    const result = validateQuizConfig("invalid");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toEqual([
        expect.objectContaining({
          path: "$",
          code: "invalid_type",
        }),
      ]);
    }
  });

  it("rejects invalid boolean config values", () => {
    const result = validateQuizConfig({
      shuffleQuestions: "yes",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toEqual([
        expect.objectContaining({
          path: "shuffleQuestions",
          code: "invalid_type",
        }),
      ]);
    }
  });

  it("rejects invalid pointsPerQuestion values", () => {
    const zeroPoints = validateQuizConfig({ pointsPerQuestion: 0 });
    const decimalPoints = validateQuizConfig({ pointsPerQuestion: 1.5 });

    expect(zeroPoints.success).toBe(false);
    expect(decimalPoints.success).toBe(false);

    if (!zeroPoints.success) {
      expect(zeroPoints.issues[0]).toMatchObject({
        path: "pointsPerQuestion",
        code: "invalid_value",
      });
    }

    if (!decimalPoints.success) {
      expect(decimalPoints.issues[0]).toMatchObject({
        path: "pointsPerQuestion",
        code: "invalid_value",
      });
    }
  });

  it("ignores unknown config keys", () => {
    const result = validateQuizConfig({
      unknownSetting: true,
      shuffleQuestions: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.shuffleQuestions).toBe(true);
    }
  });

  it("assertValidQuizConfig throws QuizValidationError for invalid input", () => {
    expect(() => assertValidQuizConfig(null)).toThrow(QuizValidationError);
  });

  it("assertValidQuizConfig passes for valid input", () => {
    expect(() => assertValidQuizConfig({ shuffleQuestions: false })).not.toThrow();
  });
});

describe("resolveQuizConfig", () => {
  it("returns defaults when called without arguments", () => {
    expect(resolveQuizConfig()).toEqual(DEFAULT_QUIZ_CONFIG);
  });
});
