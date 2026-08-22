import type { Question, QuizDefinition } from "../types/quiz-definition";
import type { ValidationIssue } from "./errors";
import type { ValidationResult } from "./errors";
import { QuizValidationError } from "./errors";
import {
  collectDuplicateIds,
  isNonEmptyString,
  isRecord,
  issue,
} from "./helpers";
import { validateQuestion } from "./validate-question";

export function validateQuizDefinition(
  input: unknown,
): ValidationResult<QuizDefinition> {
  const issues: ValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      success: false,
      issues: [issue("$", "invalid_type", "Quiz definition must be an object.")],
    };
  }

  if (!isNonEmptyString(input.id)) {
    issues.push(
      issue("id", "required", "Quiz id must be a non-empty string."),
    );
  }

  if (!isNonEmptyString(input.title)) {
    issues.push(
      issue("title", "required", "Quiz title must be a non-empty string."),
    );
  }

  if (
    input.description !== undefined &&
    typeof input.description !== "string"
  ) {
    issues.push(
      issue(
        "description",
        "invalid_type",
        "Quiz description must be a string when provided.",
      ),
    );
  }

  const questionsInput = input.questions;
  const questions: Question[] = [];

  if (!Array.isArray(questionsInput)) {
    issues.push(
      issue("questions", "invalid_type", "Questions must be an array."),
    );
  } else {
    if (questionsInput.length < 1) {
      issues.push(
        issue(
          "questions",
          "too_few_items",
          "Quiz must contain at least one question.",
        ),
      );
    }

    const questionIds: string[] = [];

    for (let index = 0; index < questionsInput.length; index += 1) {
      const questionPath = `questions[${index}]`;
      const { issues: questionIssues, question } = validateQuestion(
        questionsInput[index],
        questionPath,
      );

      issues.push(...questionIssues);

      if (question) {
        questionIds.push(question.id);
        questions.push(question);
      } else if (isRecord(questionsInput[index]) && isNonEmptyString(questionsInput[index].id)) {
        questionIds.push(questionsInput[index].id as string);
      }
    }

    for (const duplicateId of collectDuplicateIds(questionIds)) {
      issues.push(
        issue(
          "questions",
          "duplicate_id",
          `Duplicate question id "${duplicateId}".`,
        ),
      );
    }
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  const quiz: QuizDefinition = {
    id: input.id as string,
    title: input.title as string,
    questions,
  };

  if (typeof input.description === "string") {
    quiz.description = input.description;
  }

  return { success: true, data: quiz };
}

export function assertValidQuizDefinition(
  input: unknown,
): asserts input is QuizDefinition {
  const result = validateQuizDefinition(input);

  if (!result.success) {
    throw new QuizValidationError(result.issues);
  }
}
