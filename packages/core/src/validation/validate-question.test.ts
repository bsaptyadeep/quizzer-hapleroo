import { describe, expect, it } from "vitest";
import { clone } from "./fixtures/invalid-quiz";
import { validSingleChoiceQuiz } from "./fixtures/valid-quiz";
import { validateQuestion } from "./validate-question";

describe("validateQuestion", () => {
  const baseQuestion = validSingleChoiceQuiz.questions[0];
  const questionPath = "questions[0]";

  it("accepts a valid single-choice question", () => {
    const result = validateQuestion(baseQuestion, questionPath);

    expect(result.issues).toHaveLength(0);
    expect(result.question).toEqual(baseQuestion);
  });

  it("accepts a valid multiple-choice question", () => {
    const question = {
      id: "q-multi",
      type: "multiple-choice",
      question: "Select all even numbers:",
      options: [
        { id: "a", label: "2" },
        { id: "b", label: "3" },
        { id: "c", label: "4" },
      ],
      correctAnswers: ["a", "c"],
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toHaveLength(0);
    expect(result.question).toEqual(question);
  });

  it("rejects invalid question type", () => {
    const question = {
      ...clone(baseQuestion),
      type: "true-false",
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.type`,
        code: "invalid_enum",
      }),
    ]);
    expect(result.question).toBeNull();
  });

  it("rejects empty question text", () => {
    const question = {
      ...clone(baseQuestion),
      question: "   ",
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.question`,
        code: "required",
      }),
    ]);
  });

  it("rejects fewer than two options", () => {
    const question = {
      ...clone(baseQuestion),
      options: [{ id: "a", label: "Only option" }],
      correctAnswer: "a",
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: `${questionPath}.options`,
        code: "too_few_items",
      }),
    );
  });

  it("rejects duplicate option ids", () => {
    const question = {
      ...clone(baseQuestion),
      options: [
        { id: "a", label: "First" },
        { id: "a", label: "Duplicate" },
      ],
      correctAnswer: "a",
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.options`,
        code: "duplicate_id",
      }),
    ]);
  });

  it("rejects missing single-choice correctAnswer", () => {
    const question = {
      ...clone(baseQuestion),
      correctAnswer: "",
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.correctAnswer`,
        code: "required",
      }),
    ]);
  });

  it("rejects single-choice correctAnswer that does not exist in options", () => {
    const question = {
      ...clone(baseQuestion),
      correctAnswer: "missing",
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.correctAnswer`,
        code: "invalid_reference",
      }),
    ]);
  });

  it("rejects empty multiple-choice correctAnswers array", () => {
    const question = {
      id: "q-multi",
      type: "multiple-choice",
      question: "Select all valid entries:",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      correctAnswers: [],
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.correctAnswers`,
        code: "too_few_items",
      }),
    ]);
  });

  it("rejects invalid multiple-choice correctAnswers references", () => {
    const question = {
      id: "q-multi",
      type: "multiple-choice",
      question: "Select all valid entries:",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      correctAnswers: ["missing"],
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.correctAnswers[0]`,
        code: "invalid_reference",
      }),
    ]);
  });

  it("rejects duplicate multiple-choice correctAnswers", () => {
    const question = {
      id: "q-multi",
      type: "multiple-choice",
      question: "Select all valid entries:",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      correctAnswers: ["a", "a"],
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues).toEqual([
      expect.objectContaining({
        path: `${questionPath}.correctAnswers`,
        code: "duplicate_id",
      }),
    ]);
  });

  it("collects multiple issues in one validation call", () => {
    const question = {
      id: "",
      type: "invalid-type",
      question: "",
      options: [{ id: "a", label: "" }],
      correctAnswer: "missing",
    };

    const result = validateQuestion(question, questionPath);

    expect(result.issues.length).toBeGreaterThanOrEqual(4);
    expect(result.question).toBeNull();
  });
});
