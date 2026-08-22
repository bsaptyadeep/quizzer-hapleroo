import type { SingleChoiceQuestion } from "../types/quiz-definition";
import type { QuestionResult } from "../types/quiz-result";
import type { AnswerValue } from "../types/quiz-state";

export function isSingleChoiceCorrect(
  question: SingleChoiceQuestion,
  answer: AnswerValue | undefined,
): boolean {
  if (!answer || answer.type !== "single-choice") {
    return false;
  }

  return answer.selectedOptionId === question.correctAnswer;
}

export function toSingleChoiceQuestionResult(
  question: SingleChoiceQuestion,
  answer: AnswerValue | undefined,
  pointsPerQuestion: number,
): QuestionResult {
  const userAnswer: AnswerValue =
    answer?.type === "single-choice"
      ? answer
      : { type: "single-choice", selectedOptionId: null };

  const isCorrect = isSingleChoiceCorrect(question, userAnswer);

  return {
    questionId: question.id,
    type: question.type,
    isCorrect,
    pointsEarned: isCorrect ? pointsPerQuestion : 0,
    pointsPossible: pointsPerQuestion,
    userAnswer,
    correctAnswer: question.correctAnswer,
  };
}
