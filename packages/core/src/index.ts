export type {
  QuestionType,
  QuizOption,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  Question,
  QuizDefinition,
  QuizConfig,
  RequiredQuizConfig,
  QuizStatus,
  AnswerValue,
  QuizState,
  QuestionResult,
  QuizResult,
  QuizEvent,
  QuizEventType,
} from "./types";

export {
  DEFAULT_QUIZ_CONFIG,
  resolveQuizConfig,
} from "./types/quiz-config";

export {
  isSingleChoiceQuestion,
  isMultipleChoiceQuestion,
} from "./types/quiz-definition";

export {
  validateQuizDefinition,
  validateQuizConfig,
  assertValidQuizDefinition,
  assertValidQuizConfig,
  QuizValidationError,
} from "./validation";

export type {
  ValidationIssue,
  ValidationIssueCode,
  ValidationResult,
} from "./validation/errors";

export {
  evaluateQuestion,
  isSingleChoiceCorrect,
  isMultipleChoiceCorrect,
} from "./evaluation";

export {
  calculateScore,
  evaluateAllQuestions,
  buildQuizResult,
} from "./scoring";

export type { ScoreSummary } from "./scoring/calculate-score";

export { createQuizEngine } from "./engine";
export type { QuizEngine, CreateQuizEngineOptions } from "./engine/create-quiz-engine";
