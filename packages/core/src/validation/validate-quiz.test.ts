import { describe, expect, it } from "vitest";
import { clone, withField } from "./fixtures/invalid-quiz";
import {
  validMixedQuiz,
  validMultipleChoiceQuiz,
  validSingleChoiceQuiz,
} from "./fixtures/valid-quiz";
import { QuizValidationError } from "./errors";
import {
  assertValidQuizDefinition,
  validateQuizDefinition,
} from "./validate-quiz";

describe("validateQuizDefinition", () => {
  it("accepts a valid single-choice quiz", () => {
    const result = validateQuizDefinition(validSingleChoiceQuiz);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validSingleChoiceQuiz);
    }
  });

  it("accepts a valid multiple-choice quiz", () => {
    const result = validateQuizDefinition(validMultipleChoiceQuiz);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validMultipleChoiceQuiz);
    }
  });

  it("accepts a valid mixed quiz with description", () => {
    const result = validateQuizDefinition(validMixedQuiz);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validMixedQuiz);
    }
  });

  it("rejects non-object root input", () => {
    const result = validateQuizDefinition(null);

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

  it("rejects missing or empty quiz id", () => {
    const missingId = validateQuizDefinition({
      ...clone(validSingleChoiceQuiz),
      id: "",
    });

    expect(missingId.success).toBe(false);
    if (!missingId.success) {
      expect(missingId.issues).toEqual([
        expect.objectContaining({
          path: "id",
          code: "required",
        }),
      ]);
    }
  });

  it("rejects missing or empty quiz title", () => {
    const missingTitle = validateQuizDefinition({
      ...clone(validSingleChoiceQuiz),
      title: "   ",
    });

    expect(missingTitle.success).toBe(false);
    if (!missingTitle.success) {
      expect(missingTitle.issues).toEqual([
        expect.objectContaining({
          path: "title",
          code: "required",
        }),
      ]);
    }
  });

  it("rejects empty questions array", () => {
    const result = validateQuizDefinition({
      ...clone(validSingleChoiceQuiz),
      questions: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toEqual([
        expect.objectContaining({
          path: "questions",
          code: "too_few_items",
        }),
      ]);
    }
  });

  it("rejects duplicate question ids", () => {
    const quiz = withField(validMixedQuiz, "questions", [
      validMixedQuiz.questions[0],
      {
        ...clone(validMixedQuiz.questions[1]),
        id: validMixedQuiz.questions[0].id,
      },
    ]);

    const result = validateQuizDefinition(quiz);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toEqual([
        expect.objectContaining({
          path: "questions",
          code: "duplicate_id",
        }),
      ]);
    }
  });

  it("rejects invalid description type", () => {
    const result = validateQuizDefinition({
      ...clone(validMixedQuiz),
      description: 123,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toEqual([
        expect.objectContaining({
          path: "description",
          code: "invalid_type",
        }),
      ]);
    }
  });

  it("assertValidQuizDefinition throws QuizValidationError with issues", () => {
    expect(() => assertValidQuizDefinition({})).toThrow(QuizValidationError);

    try {
      assertValidQuizDefinition({});
    } catch (error) {
      expect(error).toBeInstanceOf(QuizValidationError);
      if (error instanceof QuizValidationError) {
        expect(error.issues.length).toBeGreaterThan(0);
      }
    }
  });

  it("assertValidQuizDefinition passes for valid input", () => {
    expect(() => assertValidQuizDefinition(validMixedQuiz)).not.toThrow();
  });
});
