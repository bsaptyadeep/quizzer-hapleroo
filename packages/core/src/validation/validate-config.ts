import type { QuizConfig, RequiredQuizConfig } from "../types/quiz-config";
import { resolveQuizConfig } from "../types/quiz-config";
import type { ValidationIssue } from "./errors";
import type { ValidationResult } from "./errors";
import { QuizValidationError } from "./errors";
import { isBoolean, isPositiveInteger, isRecord, issue } from "./helpers";

const BOOLEAN_CONFIG_KEYS = [
  "shuffleQuestions",
  "shuffleOptions",
  "allowBackNavigation",
  "requireAnswerToProceed",
  "showPercentage",
] as const;

export function validateQuizConfig(
  input: unknown,
): ValidationResult<RequiredQuizConfig> {
  if (input === undefined) {
    return { success: true, data: resolveQuizConfig() };
  }

  if (!isRecord(input)) {
    return {
      success: false,
      issues: [issue("$", "invalid_type", "Quiz config must be an object.")],
    };
  }

  const issues: ValidationIssue[] = [];

  for (const key of BOOLEAN_CONFIG_KEYS) {
    const value = input[key];
    if (value !== undefined && !isBoolean(value)) {
      issues.push(
        issue(key, "invalid_type", `${key} must be a boolean when provided.`),
      );
    }
  }

  if (
    input.pointsPerQuestion !== undefined &&
    !isPositiveInteger(input.pointsPerQuestion)
  ) {
    issues.push(
      issue(
        "pointsPerQuestion",
        "invalid_value",
        "pointsPerQuestion must be an integer greater than or equal to 1.",
      ),
    );
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  const config: QuizConfig = {};

  for (const key of BOOLEAN_CONFIG_KEYS) {
    const value = input[key];
    if (isBoolean(value)) {
      config[key] = value;
    }
  }

  if (isPositiveInteger(input.pointsPerQuestion)) {
    config.pointsPerQuestion = input.pointsPerQuestion;
  }

  return { success: true, data: resolveQuizConfig(config) };
}

export function assertValidQuizConfig(
  input: unknown,
): asserts input is RequiredQuizConfig {
  const result = validateQuizConfig(input);

  if (!result.success) {
    throw new QuizValidationError(result.issues);
  }
}
