import type { QuizDefinition } from "../types/quiz-definition";
import type { QuizState } from "../types/quiz-state";

export function createInitialState(definition: QuizDefinition): QuizState {
  return {
    status: "not_started",
    currentQuestionIndex: 0,
    answers: {},
    startedAt: null,
    completedAt: null,
    questionOrder: definition.questions.map((question) => question.id),
    optionOrder: Object.fromEntries(
      definition.questions.map((question) => [
        question.id,
        question.options.map((option) => option.id),
      ]),
    ),
  };
}
