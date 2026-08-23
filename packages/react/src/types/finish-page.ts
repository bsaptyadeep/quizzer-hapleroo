import type { QuizDefinition, QuizResult } from "hapleroo-quizzard-core";

export interface FinishPageTier {
  minPercentage: number;
  title: string;
  subtitle?: string;
}

export interface FinishPageConfig {
  title?: string | ((result: QuizResult) => string);
  subtitle?: string | ((result: QuizResult) => string);
  tiers?: FinishPageTier[];
  variant?: "default" | "minimal";
  showScore?: boolean;
  showPercentage?: boolean;
  showDuration?: boolean;
  showQuestionBreakdown?: boolean;
  restartLabel?: string;
  hideRestart?: boolean;
  className?: string;
}

export interface FinishPageRenderProps {
  result: QuizResult;
  definition: QuizDefinition;
  restart: () => void;
}
