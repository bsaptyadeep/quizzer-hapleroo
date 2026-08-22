import type { Question, QuestionType } from "../types/quiz-definition";
import {
  isMultipleChoiceQuestion,
  isSingleChoiceQuestion,
} from "../types/quiz-definition";
import type { QuestionResult } from "../types/quiz-result";
import type { AnswerValue } from "../types/quiz-state";
import { toMultipleChoiceQuestionResult } from "./multiple-choice";
import { toSingleChoiceQuestionResult } from "./single-choice";

export type QuestionEvaluator = (
  question: Question,
  answer: AnswerValue | undefined,
  pointsPerQuestion: number,
) => QuestionResult;

export function getQuestionEvaluator(type: QuestionType): QuestionEvaluator {
  if (type === "single-choice") {
    return (question, answer, pointsPerQuestion) => {
      if (!isSingleChoiceQuestion(question)) {
        throw new Error(`Expected single-choice question, got "${question.type}".`);
      }

      return toSingleChoiceQuestionResult(question, answer, pointsPerQuestion);
    };
  }

  if (type === "multiple-choice") {
    return (question, answer, pointsPerQuestion) => {
      if (!isMultipleChoiceQuestion(question)) {
        throw new Error(`Expected multiple-choice question, got "${question.type}".`);
      }

      return toMultipleChoiceQuestionResult(question, answer, pointsPerQuestion);
    };
  }

  throw new Error(`Unsupported question type: ${type satisfies never}`);
}
