import type { Question } from "../types/quiz-definition";
import type { QuestionResult } from "../types/quiz-result";
import type { AnswerValue } from "../types/quiz-state";
import { getQuestionEvaluator } from "./registry";

export function evaluateQuestion(
  question: Question,
  answer: AnswerValue | undefined,
  pointsPerQuestion = 1,
): QuestionResult {
  return getQuestionEvaluator(question.type)(question, answer, pointsPerQuestion);
}
