import type { MultipleChoiceQuestion } from "../types/quiz-definition";
import type { QuestionResult } from "../types/quiz-result";
import type { AnswerValue } from "../types/quiz-state";
import { setsEqual } from "../utils/set-equality";

export function isMultipleChoiceCorrect(
  question: MultipleChoiceQuestion,
  answer: AnswerValue | undefined,
): boolean {
  if (!answer || answer.type !== "multiple-choice") {
    return false;
  }

  return setsEqual(
    new Set(question.correctAnswers),
    new Set(answer.selectedOptionIds),
  );
}

export function toMultipleChoiceQuestionResult(
  question: MultipleChoiceQuestion,
  answer: AnswerValue | undefined,
  pointsPerQuestion: number,
): QuestionResult {
  const userAnswer: AnswerValue =
    answer?.type === "multiple-choice"
      ? answer
      : { type: "multiple-choice", selectedOptionIds: [] };

  const isCorrect = isMultipleChoiceCorrect(question, userAnswer);

  return {
    questionId: question.id,
    type: question.type,
    isCorrect,
    pointsEarned: isCorrect ? pointsPerQuestion : 0,
    pointsPossible: pointsPerQuestion,
    userAnswer,
    correctAnswer: question.correctAnswers,
  };
}
