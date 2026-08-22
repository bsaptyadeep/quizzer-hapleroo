export type {
  QuestionType,
  QuizOption,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  Question,
  QuizDefinition,
} from "./quiz-definition";
export {
  isSingleChoiceQuestion,
  isMultipleChoiceQuestion,
} from "./quiz-definition";

export type { QuizConfig, RequiredQuizConfig } from "./quiz-config";
export { DEFAULT_QUIZ_CONFIG, resolveQuizConfig } from "./quiz-config";

export type { QuizStatus, AnswerValue, QuizState } from "./quiz-state";

export type { QuestionResult, QuizResult } from "./quiz-result";

export type { QuizEvent, QuizEventType } from "./events";
