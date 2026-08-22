import type { QuizResult, QuestionResult } from "../types/quiz-result";
import { calculateScore } from "./calculate-score";

export function buildQuizResult(input: {
  quizId: string;
  questionResults: QuestionResult[];
  startedAt: number;
  completedAt: number;
}): QuizResult {
  const { score, maxScore, percentage } = calculateScore(input.questionResults);

  return {
    quizId: input.quizId,
    score,
    maxScore,
    percentage,
    questionResults: input.questionResults,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMs: input.completedAt - input.startedAt,
  };
}
