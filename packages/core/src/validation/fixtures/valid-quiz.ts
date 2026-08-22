import type { QuizDefinition } from "../../types/quiz-definition";

export const validSingleChoiceQuiz: QuizDefinition = {
  id: "single-choice-quiz",
  title: "Single Choice Quiz",
  questions: [
    {
      id: "q1",
      type: "single-choice",
      question: "Which keyword declares a block-scoped variable?",
      options: [
        { id: "a", label: "var" },
        { id: "b", label: "let" },
        { id: "c", label: "function" },
      ],
      correctAnswer: "b",
    },
  ],
};

export const validMultipleChoiceQuiz: QuizDefinition = {
  id: "multiple-choice-quiz",
  title: "Multiple Choice Quiz",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Select all primitive types in JavaScript:",
      options: [
        { id: "a", label: "string" },
        { id: "b", label: "object" },
        { id: "c", label: "number" },
        { id: "d", label: "null" },
      ],
      correctAnswers: ["a", "c", "d"],
    },
  ],
};

export const validMixedQuiz: QuizDefinition = {
  id: "mixed-quiz",
  title: "Mixed Quiz",
  description: "A quiz with single and multiple choice questions.",
  questions: [
    {
      id: "q1",
      type: "single-choice",
      question: "What is 2 + 2?",
      options: [
        { id: "a", label: "3" },
        { id: "b", label: "4" },
        { id: "c", label: "5" },
      ],
      correctAnswer: "b",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Select all vowels:",
      options: [
        { id: "a", label: "a" },
        { id: "b", label: "b" },
        { id: "c", label: "e" },
        { id: "d", label: "z" },
      ],
      correctAnswers: ["a", "c"],
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Which planet is known as the Red Planet?",
      options: [
        { id: "a", label: "Venus" },
        { id: "b", label: "Mars" },
        { id: "c", label: "Jupiter" },
      ],
      correctAnswer: "b",
    },
  ],
};
