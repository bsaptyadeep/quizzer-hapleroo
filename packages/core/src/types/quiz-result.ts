import type { AnswerValue } from "./quiz-state";
import type { QuestionType } from "./quiz-definition";

export interface QuestionResult {
  questionId: string;
  type: QuestionType;
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  userAnswer: AnswerValue;
  correctAnswer: string | string[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  maxScore: number;
  percentage: number;
  questionResults: QuestionResult[];
  startedAt: number;
  completedAt: number;
  durationMs: number;
}
