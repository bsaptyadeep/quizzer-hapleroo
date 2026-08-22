import type { AnswerValue } from "../types/quiz-state";
import type { Question } from "../types/quiz-definition";
import {
  isMultipleChoiceQuestion,
  isSingleChoiceQuestion,
} from "../types/quiz-definition";

export function isAnswerComplete(
  question: Question,
  answer: AnswerValue | undefined,
): boolean {
  if (!answer) {
    return false;
  }

  if (isSingleChoiceQuestion(question)) {
    return (
      answer.type === "single-choice" && answer.selectedOptionId !== null
    );
  }

  if (isMultipleChoiceQuestion(question)) {
    return (
      answer.type === "multiple-choice" && answer.selectedOptionIds.length >= 1
    );
  }

  return false;
}
