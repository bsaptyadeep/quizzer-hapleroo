import type { QuizConfig, RequiredQuizConfig } from "../types/quiz-config";
import { resolveQuizConfig } from "../types/quiz-config";
import type { QuizDefinition, Question } from "../types/quiz-definition";
import type { QuizEvent } from "../types/events";
import type { QuizResult } from "../types/quiz-result";
import type { AnswerValue, QuizState } from "../types/quiz-state";
import { assertValidQuizDefinition } from "../validation/validate-quiz";
import { buildQuizResult } from "../scoring/build-quiz-result";
import { evaluateAllQuestions } from "../scoring/calculate-score";
import { getCurrentQuestion, getQuestionById } from "../utils/questions";
import { isAnswerComplete } from "./answer-helpers";
import { createEventEmitter } from "./event-emitter";
import { createInitialState } from "./initial-state";
import {
  canGoNext,
  canGoPrevious,
  canSubmit,
  clampQuestionIndex,
  isAnswered,
} from "./navigation";
import { quizReducer } from "./reducer";
import { resolveOptionOrder, resolveQuestionOrder } from "./shuffle";

export interface QuizEngine {
  getDefinition(): Readonly<QuizDefinition>;
  getConfig(): Readonly<RequiredQuizConfig>;
  getState(): Readonly<QuizState>;
  getResult(): QuizResult | null;

  start(): void;
  answer(questionId: string, value: AnswerValue): void;
  next(): void;
  previous(): void;
  goTo(index: number): void;
  submit(): QuizResult;
  restart(): void;

  getCurrentQuestion(): Question | null;
  canGoNext(): boolean;
  canGoPrevious(): boolean;
  canSubmit(): boolean;
  isAnswered(questionId: string): boolean;

  subscribe(listener: (event: QuizEvent) => void): () => void;
  subscribeToState(listener: (state: QuizState) => void): () => void;
}

export interface CreateQuizEngineOptions {
  random?: () => number;
}

export function createQuizEngine(
  definition: QuizDefinition,
  config?: QuizConfig,
  options?: CreateQuizEngineOptions,
): QuizEngine {
  assertValidQuizDefinition(definition);

  const resolvedConfig = resolveQuizConfig(config);
  const random = options?.random ?? Math.random;
  const emitter = createEventEmitter();

  let state = createInitialState(definition);
  let result: QuizResult | null = null;

  const dispatch = (action: Parameters<typeof quizReducer>[1]): void => {
    state = quizReducer(state, action, definition);
    emitter.emitState(state);
  };

  const emit = (event: QuizEvent): void => {
    emitter.emit({
      ...event,
      timestamp: event.timestamp ?? Date.now(),
    });
  };

  const emitQuestionViewed = (): void => {
    const question = getCurrentQuestion(definition, state);
    if (!question) {
      return;
    }

    emit({
      type: "question:viewed",
      timestamp: Date.now(),
      payload: {
        quizId: definition.id,
        questionId: question.id,
        index: state.currentQuestionIndex,
      },
    });
  };

  return {
    getDefinition: () => definition,
    getConfig: () => resolvedConfig,
    getState: () => state,
    getResult: () => result,

    start() {
      if (state.status !== "not_started") {
        return;
      }

      const startedAt = Date.now();
      dispatch({
        type: "START",
        payload: {
          startedAt,
          questionOrder: resolveQuestionOrder(
            definition,
            resolvedConfig.shuffleQuestions,
            random,
          ),
          optionOrder: resolveOptionOrder(
            definition,
            resolvedConfig.shuffleOptions,
            random,
          ),
        },
      });

      emit({
        type: "quiz:started",
        timestamp: Date.now(),
        payload: { quizId: definition.id },
      });
      emitQuestionViewed();
    },

    answer(questionId, value) {
      if (state.status !== "in_progress") {
        throw new Error("Cannot answer questions unless the quiz is in progress.");
      }

      const question = getQuestionById(definition, questionId);
      if (!question) {
        throw new Error(`Unknown question id "${questionId}".`);
      }

      dispatch({
        type: "ANSWER",
        payload: { questionId, value },
      });

      emit({
        type: "answer:selected",
        timestamp: Date.now(),
        payload: {
          quizId: definition.id,
          questionId,
          value,
        },
      });

      emit({
        type: "question:answered",
        timestamp: Date.now(),
        payload: {
          quizId: definition.id,
          questionId,
          isComplete: isAnswerComplete(question, value),
        },
      });
    },

    next() {
      if (!canGoNext(definition, state, resolvedConfig)) {
        return;
      }

      const fromIndex = state.currentQuestionIndex;
      dispatch({ type: "NEXT" });

      emit({
        type: "navigation:next",
        timestamp: Date.now(),
        payload: {
          fromIndex,
          toIndex: state.currentQuestionIndex,
        },
      });
      emitQuestionViewed();
    },

    previous() {
      if (!canGoPrevious(state, resolvedConfig)) {
        return;
      }

      const fromIndex = state.currentQuestionIndex;
      dispatch({ type: "PREVIOUS" });

      emit({
        type: "navigation:previous",
        timestamp: Date.now(),
        payload: {
          fromIndex,
          toIndex: state.currentQuestionIndex,
        },
      });
      emitQuestionViewed();
    },

    goTo(index) {
      if (state.status !== "in_progress") {
        return;
      }

      const nextIndex = clampQuestionIndex(index, state.questionOrder.length);
      if (nextIndex === state.currentQuestionIndex) {
        return;
      }

      dispatch({ type: "GO_TO", payload: { index: nextIndex } });
      emitQuestionViewed();
    },

    submit() {
      if (!canSubmit(definition, state, resolvedConfig)) {
        throw new Error("Cannot submit the quiz until all requirements are met.");
      }

      const completedAt = Date.now();
      emit({
        type: "quiz:submitted",
        timestamp: Date.now(),
        payload: { quizId: definition.id },
      });

      const questionResults = evaluateAllQuestions(
        definition,
        state.answers,
        resolvedConfig.pointsPerQuestion,
        state.questionOrder,
      );

      const quizResult = buildQuizResult({
        quizId: definition.id,
        questionResults,
        startedAt: state.startedAt ?? completedAt,
        completedAt,
      });

      dispatch({ type: "SUBMIT", payload: { completedAt } });
      result = quizResult;

      emit({
        type: "quiz:completed",
        timestamp: Date.now(),
        payload: {
          quizId: definition.id,
          result: quizResult,
        },
      });

      return quizResult;
    },

    restart() {
      dispatch({ type: "RESTART" });
      result = null;
      emit({
        type: "quiz:restarted",
        timestamp: Date.now(),
        payload: { quizId: definition.id },
      });
    },

    getCurrentQuestion() {
      return getCurrentQuestion(definition, state);
    },

    canGoNext() {
      return canGoNext(definition, state, resolvedConfig);
    },

    canGoPrevious() {
      return canGoPrevious(state, resolvedConfig);
    },

    canSubmit() {
      return canSubmit(definition, state, resolvedConfig);
    },

    isAnswered(questionId) {
      return isAnswered(definition, state, questionId);
    },

    subscribe(listener) {
      return emitter.subscribe(listener);
    },

    subscribeToState(listener) {
      return emitter.subscribeToState(listener);
    },
  };
}
