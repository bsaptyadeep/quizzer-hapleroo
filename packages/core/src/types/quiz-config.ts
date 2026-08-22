export interface QuizConfig {
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowBackNavigation?: boolean;
  requireAnswerToProceed?: boolean;
  showPercentage?: boolean;
  pointsPerQuestion?: number;
}

export type RequiredQuizConfig = Required<QuizConfig>;

export const DEFAULT_QUIZ_CONFIG: RequiredQuizConfig = {
  shuffleQuestions: false,
  shuffleOptions: false,
  allowBackNavigation: true,
  requireAnswerToProceed: true,
  showPercentage: true,
  pointsPerQuestion: 1,
};

export function resolveQuizConfig(partial?: QuizConfig): RequiredQuizConfig {
  return {
    ...DEFAULT_QUIZ_CONFIG,
    ...partial,
  };
}
