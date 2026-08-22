import type { QuizEvent } from "../types/events";
import type { QuizState } from "../types/quiz-state";

export function createEventEmitter() {
  const eventListeners = new Set<(event: QuizEvent) => void>();
  const stateListeners = new Set<(state: QuizState) => void>();

  return {
    subscribe(listener: (event: QuizEvent) => void): () => void {
      eventListeners.add(listener);
      return () => {
        eventListeners.delete(listener);
      };
    },

    subscribeToState(listener: (state: QuizState) => void): () => void {
      stateListeners.add(listener);
      return () => {
        stateListeners.delete(listener);
      };
    },

    emit(event: QuizEvent): void {
      for (const listener of eventListeners) {
        listener(event);
      }
    },

    emitState(state: QuizState): void {
      for (const listener of stateListeners) {
        listener(state);
      }
    },
  };
}

export type EngineEmitter = ReturnType<typeof createEventEmitter>;
