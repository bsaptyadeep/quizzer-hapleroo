import type { RequiredQuizConfig } from "../types/quiz-config";
import type { QuizDefinition } from "../types/quiz-definition";
import type { QuizState } from "../types/quiz-state";
import { isAnswerComplete } from "./answer-helpers";
import { getQuestionById } from "../utils/questions";

export function isAnswered(
  definition: QuizDefinition,
  state: QuizState,
  questionId: string,
): boolean {
  const question = getQuestionById(definition, questionId);
  if (!question) {
    return false;
  }

  return isAnswerComplete(question, state.answers[questionId]);
}

export function canGoNext(
  definition: QuizDefinition,
  state: QuizState,
  config: RequiredQuizConfig,
): boolean {
  if (state.status !== "in_progress") {
    return false;
  }

  const isLastQuestion =
    state.currentQuestionIndex >= state.questionOrder.length - 1;

  if (isLastQuestion) {
    return false;
  }

  if (!config.requireAnswerToProceed) {
    return true;
  }

  const currentQuestionId = state.questionOrder[state.currentQuestionIndex];
  return currentQuestionId
    ? isAnswered(definition, state, currentQuestionId)
    : false;
}

export function canGoPrevious(
  state: QuizState,
  config: RequiredQuizConfig,
): boolean {
  if (state.status !== "in_progress") {
    return false;
  }

  return config.allowBackNavigation && state.currentQuestionIndex > 0;
}

export function canSubmit(
  definition: QuizDefinition,
  state: QuizState,
  config: RequiredQuizConfig,
): boolean {
  if (state.status !== "in_progress") {
    return false;
  }

  const isLastQuestion =
    state.currentQuestionIndex >= state.questionOrder.length - 1;

  if (!isLastQuestion) {
    return false;
  }

  if (!config.requireAnswerToProceed) {
    return true;
  }

  return state.questionOrder.every((questionId) =>
    isAnswered(definition, state, questionId),
  );
}

export function clampQuestionIndex(index: number, questionCount: number): number {
  if (questionCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), questionCount - 1);
}
