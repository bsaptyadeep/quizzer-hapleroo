export type {
  ValidationIssue,
  ValidationIssueCode,
  ValidationResult,
} from "./errors";
export { QuizValidationError } from "./errors";

export {
  validateQuizDefinition,
  assertValidQuizDefinition,
} from "./validate-quiz";
export { validateQuizConfig, assertValidQuizConfig } from "./validate-config";
