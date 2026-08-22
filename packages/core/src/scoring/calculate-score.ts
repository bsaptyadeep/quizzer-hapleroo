import type { QuizDefinition } from "../types/quiz-definition";
import { getQuestionById } from "../utils/questions";
import type { QuestionResult } from "../types/quiz-result";
import type { AnswerValue } from "../types/quiz-state";
import { evaluateQuestion } from "../evaluation/evaluate-question";

export interface ScoreSummary {
  score: number;
  maxScore: number;
  percentage: number;
}

export function calculateScore(questionResults: QuestionResult[]): ScoreSummary {
  const score = questionResults.reduce(
    (total, result) => total + result.pointsEarned,
    0,
  );
  const maxScore = questionResults.reduce(
    (total, result) => total + result.pointsPossible,
    0,
  );
  const percentage =
    maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return { score, maxScore, percentage };
}

export function evaluateAllQuestions(
  definition: QuizDefinition,
  answers: Record<string, AnswerValue>,
  pointsPerQuestion = 1,
  questionOrder?: string[],
): QuestionResult[] {
  const order =
    questionOrder ?? definition.questions.map((question) => question.id);

  return order.flatMap((questionId) => {
    const question = getQuestionById(definition, questionId);
    if (!question) {
      return [];
    }

    return [
      evaluateQuestion(question, answers[questionId], pointsPerQuestion),
    ];
  });
}
