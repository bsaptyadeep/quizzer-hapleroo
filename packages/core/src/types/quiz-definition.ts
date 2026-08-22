export type QuestionType = "single-choice" | "multiple-choice";

export interface QuizOption {
  id: string;
  label: string;
}

interface BaseQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single-choice";
  correctAnswer: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  correctAnswers: string[];
}

export type Question = SingleChoiceQuestion | MultipleChoiceQuestion;

export interface QuizDefinition {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export function isSingleChoiceQuestion(
  question: Question,
): question is SingleChoiceQuestion {
  return question.type === "single-choice";
}

export function isMultipleChoiceQuestion(
  question: Question,
): question is MultipleChoiceQuestion {
  return question.type === "multiple-choice";
}
