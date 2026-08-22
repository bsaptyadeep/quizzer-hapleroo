import type { QuizDefinition } from "../types/quiz-definition";

export function shuffleArray<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function resolveQuestionOrder(
  definition: QuizDefinition,
  shuffle: boolean,
  random?: () => number,
): string[] {
  const questionIds = definition.questions.map((question) => question.id);
  return shuffle ? shuffleArray(questionIds, random) : questionIds;
}

export function resolveOptionOrder(
  definition: QuizDefinition,
  shuffle: boolean,
  random?: () => number,
): Record<string, string[]> {
  return Object.fromEntries(
    definition.questions.map((question) => [
      question.id,
      shuffle
        ? shuffleArray(
            question.options.map((option) => option.id),
            random,
          )
        : question.options.map((option) => option.id),
    ]),
  );
}
