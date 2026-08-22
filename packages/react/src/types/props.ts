import type {
  AnswerValue,
  QuizConfig,
  QuizDefinition,
  QuizEvent,
  QuizResult,
} from "@quiz/core";

export interface QuizProps {
  quiz: QuizDefinition;
  config?: QuizConfig;
  className?: string;
  autoStart?: boolean;
  onStart?: () => void;
  onAnswer?: (payload: { questionId: string; value: AnswerValue }) => void;
  onComplete?: (result: QuizResult) => void;
  onEvent?: (event: QuizEvent) => void;
}
