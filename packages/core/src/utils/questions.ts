import type { QuizDefinition, Question } from "../types/quiz-definition";
import type { QuizState } from "../types/quiz-state";

export function getQuestionById(
  definition: QuizDefinition,
  questionId: string,
): Question | undefined {
  return definition.questions.find((question) => question.id === questionId);
}

export function getCurrentQuestion(
  definition: QuizDefinition,
  state: QuizState,
): Question | null {
  const questionId = state.questionOrder[state.currentQuestionIndex];
  if (!questionId) {
    return null;
  }

  return getQuestionById(definition, questionId) ?? null;
}
