import type { ReactNode } from "react";
import type {
  AnswerValue,
  QuizConfig,
  QuizDefinition,
  QuizEvent,
  QuizResult,
} from "hapleroo-quizzard-core";
import type { FinishPageConfig, FinishPageRenderProps } from "./finish-page";

export type { FinishPageConfig, FinishPageRenderProps, FinishPageTier } from "./finish-page";

export interface QuizProps {
  quiz: QuizDefinition;
  config?: QuizConfig;
  className?: string;
  autoStart?: boolean;
  finishPage?: FinishPageConfig;
  renderFinishPage?: (props: FinishPageRenderProps) => ReactNode;
  onStart?: () => void;
  onAnswer?: (payload: { questionId: string; value: AnswerValue }) => void;
  onComplete?: (result: QuizResult) => void;
  onEvent?: (event: QuizEvent) => void;
}
