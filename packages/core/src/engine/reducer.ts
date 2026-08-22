import type { QuizDefinition } from "../types/quiz-definition";
import type { QuizState } from "../types/quiz-state";
import type { EngineAction } from "./actions";
import { createInitialState } from "./initial-state";
import { clampQuestionIndex } from "./navigation";

export function quizReducer(
  state: QuizState,
  action: EngineAction,
  definition: QuizDefinition,
): QuizState {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "in_progress",
        currentQuestionIndex: 0,
        answers: {},
        startedAt: action.payload.startedAt,
        completedAt: null,
        questionOrder: action.payload.questionOrder,
        optionOrder: action.payload.optionOrder,
      };
    case "ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.value,
        },
      };
    case "NEXT":
      return {
        ...state,
        currentQuestionIndex: clampQuestionIndex(
          state.currentQuestionIndex + 1,
          state.questionOrder.length,
        ),
      };
    case "PREVIOUS":
      return {
        ...state,
        currentQuestionIndex: clampQuestionIndex(
          state.currentQuestionIndex - 1,
          state.questionOrder.length,
        ),
      };
    case "GO_TO":
      return {
        ...state,
        currentQuestionIndex: clampQuestionIndex(
          action.payload.index,
          state.questionOrder.length,
        ),
      };
    case "SUBMIT":
      return {
        ...state,
        status: "completed",
        completedAt: action.payload.completedAt,
      };
    case "RESTART":
      return createInitialState(definition);
    default:
      return state;
  }
}
