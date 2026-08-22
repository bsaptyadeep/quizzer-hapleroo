import type { AnswerValue } from "./quiz-state";
import type { QuizResult } from "./quiz-result";

export type QuizEvent =
  | {
      type: "quiz:started";
      timestamp: number;
      payload: { quizId: string };
    }
  | {
      type: "quiz:restarted";
      timestamp: number;
      payload: { quizId: string };
    }
  | {
      type: "question:viewed";
      timestamp: number;
      payload: { quizId: string; questionId: string; index: number };
    }
  | {
      type: "answer:selected";
      timestamp: number;
      payload: { quizId: string; questionId: string; value: AnswerValue };
    }
  | {
      type: "question:answered";
      timestamp: number;
      payload: { quizId: string; questionId: string; isComplete: boolean };
    }
  | {
      type: "navigation:next" | "navigation:previous";
      timestamp: number;
      payload: { fromIndex: number; toIndex: number };
    }
  | {
      type: "quiz:submitted";
      timestamp: number;
      payload: { quizId: string };
    }
  | {
      type: "quiz:completed";
      timestamp: number;
      payload: { quizId: string; result: QuizResult };
    };

export type QuizEventType = QuizEvent["type"];
