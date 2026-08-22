import {
  createQuizEngine,
  type AnswerValue,
  type Question,
  type QuizConfig,
  type QuizDefinition,
  type QuizEngine,
  type QuizEvent,
  type QuizResult,
  type QuizState,
  type RequiredQuizConfig,
} from "hapleroo-quizzard-core";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

export interface UseQuizEngineOptions {
  quiz: QuizDefinition;
  config?: QuizConfig;
  autoStart?: boolean;
  onStart?: () => void;
  onAnswer?: (payload: { questionId: string; value: AnswerValue }) => void;
  onComplete?: (result: QuizResult) => void;
  onEvent?: (event: QuizEvent) => void;
}

export interface UseQuizEngineReturn {
  engine: QuizEngine;
  state: QuizState;
  result: QuizResult | null;
  currentQuestion: Question | null;
  definition: QuizDefinition;
  config: RequiredQuizConfig;
  actions: {
    start: () => void;
    answer: (questionId: string, value: AnswerValue) => void;
    next: () => void;
    previous: () => void;
    submit: () => QuizResult;
    restart: () => void;
  };
  canGoNext: boolean;
  canGoPrevious: boolean;
  canSubmit: boolean;
}

export function useQuizEngine(options: UseQuizEngineOptions): UseQuizEngineReturn {
  const { quiz, config, autoStart = false } = options;

  const [engine, setEngine] = useState(() => createQuizEngine(quiz, config));
  const autoStartedRef = useRef(false);
  const quizIdRef = useRef(quiz.id);
  const configKeyRef = useRef(JSON.stringify(config ?? {}));

  const callbacksRef = useRef({
    onStart: options.onStart,
    onAnswer: options.onAnswer,
    onComplete: options.onComplete,
    onEvent: options.onEvent,
  });

  useEffect(() => {
    callbacksRef.current = {
      onStart: options.onStart,
      onAnswer: options.onAnswer,
      onComplete: options.onComplete,
      onEvent: options.onEvent,
    };
  });

  useEffect(() => {
    const configKey = JSON.stringify(config ?? {});
    if (quizIdRef.current === quiz.id && configKeyRef.current === configKey) {
      return;
    }

    quizIdRef.current = quiz.id;
    configKeyRef.current = configKey;
    setEngine(createQuizEngine(quiz, config));
    autoStartedRef.current = false;
  }, [quiz, config]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => engine.subscribeToState(onStoreChange),
    [engine],
  );

  const getSnapshot = useCallback(() => engine.getState(), [engine]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    return engine.subscribe((event) => {
      callbacksRef.current.onEvent?.(event);

      switch (event.type) {
        case "quiz:started":
          callbacksRef.current.onStart?.();
          break;
        case "answer:selected":
          callbacksRef.current.onAnswer?.({
            questionId: event.payload.questionId,
            value: event.payload.value,
          });
          break;
        case "quiz:completed":
          callbacksRef.current.onComplete?.(event.payload.result);
          break;
        default:
          break;
      }
    });
  }, [engine]);

  useEffect(() => {
    if (autoStart && !autoStartedRef.current && engine.getState().status === "not_started") {
      autoStartedRef.current = true;
      engine.start();
    }
  }, [autoStart, engine]);

  const actions = {
    start: () => engine.start(),
    answer: (questionId: string, value: AnswerValue) =>
      engine.answer(questionId, value),
    next: () => engine.next(),
    previous: () => engine.previous(),
    submit: () => engine.submit(),
    restart: () => engine.restart(),
  };

  return {
    engine,
    state,
    result: engine.getResult(),
    currentQuestion: engine.getCurrentQuestion(),
    definition: engine.getDefinition(),
    config: engine.getConfig(),
    actions,
    canGoNext: engine.canGoNext(),
    canGoPrevious: engine.canGoPrevious(),
    canSubmit: engine.canSubmit(),
  };
}
