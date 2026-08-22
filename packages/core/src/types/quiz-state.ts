export type QuizStatus = "not_started" | "in_progress" | "completed";

export type AnswerValue =
  | { type: "single-choice"; selectedOptionId: string | null }
  | { type: "multiple-choice"; selectedOptionIds: string[] };

export interface QuizState {
  status: QuizStatus;
  currentQuestionIndex: number;
  answers: Record<string, AnswerValue>;
  startedAt: number | null;
  completedAt: number | null;
  questionOrder: string[];
  optionOrder: Record<string, string[]>;
}
