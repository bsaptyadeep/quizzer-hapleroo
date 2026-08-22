import type { AnswerValue } from "../../types/quiz-state";

export function mixedQuizAllCorrect(): Record<string, AnswerValue> {
  return {
    q1: { type: "single-choice", selectedOptionId: "b" },
    q2: { type: "multiple-choice", selectedOptionIds: ["a", "c"] },
    q3: { type: "single-choice", selectedOptionId: "b" },
  };
}

export function answerCurrentQuestion(
  engine: {
    getCurrentQuestion(): { id: string; type: string } | null;
    answer(questionId: string, value: AnswerValue): void;
  },
  value: AnswerValue,
): void {
  const question = engine.getCurrentQuestion();
  if (!question) {
    throw new Error("No current question to answer.");
  }

  engine.answer(question.id, value);
}

export function completeMixedQuiz(
  engine: {
    getCurrentQuestion(): { id: string; type: string } | null;
    answer(questionId: string, value: AnswerValue): void;
    next(): void;
    canGoNext(): boolean;
    canSubmit(): boolean;
    submit(): unknown;
  },
): unknown {
  const answers = mixedQuizAllCorrect();
  const order = ["q1", "q2", "q3"];

  for (let index = 0; index < order.length; index += 1) {
    const questionId = order[index];
    const answer = answers[questionId];
    if (answer) {
      engine.answer(questionId, answer);
    }

    if (index < order.length - 1 && engine.canGoNext()) {
      engine.next();
    }
  }

  return engine.submit();
}
