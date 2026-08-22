import type { AnswerValue } from "../types/quiz-state";

export type EngineAction =
  | {
      type: "START";
      payload: {
        startedAt: number;
        questionOrder: string[];
        optionOrder: Record<string, string[]>;
      };
    }
  | { type: "ANSWER"; payload: { questionId: string; value: AnswerValue } }
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "GO_TO"; payload: { index: number } }
  | { type: "SUBMIT"; payload: { completedAt: number } }
  | { type: "RESTART" };
