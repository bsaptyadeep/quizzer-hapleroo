export interface ApiRow {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
}

export const QUIZ_PROPS: ApiRow[] = [
  {
    name: "quiz",
    type: "QuizDefinition",
    required: true,
    description: "The quiz definition including id, title, and questions array.",
  },
  {
    name: "config",
    type: "QuizConfig",
    description: "Optional behavior settings such as shuffling and navigation rules.",
  },
  {
    name: "className",
    type: "string",
    description: "CSS class applied to the quiz root for theming via CSS variables.",
  },
  {
    name: "autoStart",
    type: "boolean",
    default: "false",
    description: "Skip the start screen and begin on the first question. Also applies after restart.",
  },
  {
    name: "finishPage",
    type: "FinishPageConfig",
    description: "Configure the finish/result screen: tiers, variant, breakdown, labels.",
  },
  {
    name: "renderFinishPage",
    type: "(props: FinishPageRenderProps) => ReactNode",
    description: "Custom render function that replaces the built-in finish page template.",
  },
  {
    name: "onStart",
    type: "() => void",
    description: "Called when the user starts the quiz.",
  },
  {
    name: "onAnswer",
    type: "({ questionId, value }) => void",
    description: "Called when the user selects or changes an answer.",
  },
  {
    name: "onComplete",
    type: "(result: QuizResult) => void",
    description: "Called when the quiz is submitted with the final scored result.",
  },
  {
    name: "onEvent",
    type: "(event: QuizEvent) => void",
    description: "Called for every engine event (navigation, answers, completion).",
  },
];

export const QUIZ_CONFIG: ApiRow[] = [
  {
    name: "shuffleQuestions",
    type: "boolean",
    default: "false",
    description: "Randomize question order when the quiz starts.",
  },
  {
    name: "shuffleOptions",
    type: "boolean",
    default: "false",
    description: "Randomize option order for each question.",
  },
  {
    name: "allowBackNavigation",
    type: "boolean",
    default: "true",
    description: "Allow navigating to previous questions.",
  },
  {
    name: "requireAnswerToProceed",
    type: "boolean",
    default: "true",
    description: "Disable Next until the current question has an answer.",
  },
  {
    name: "showPercentage",
    type: "boolean",
    default: "true",
    description: "Show percentage on the result screen.",
  },
  {
    name: "pointsPerQuestion",
    type: "number",
    default: "1",
    description: "Points awarded per correctly answered question.",
  },
];

export const QUIZ_DEFINITION: ApiRow[] = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the quiz.",
  },
  {
    name: "title",
    type: "string",
    required: true,
    description: "Display title shown in the quiz header.",
  },
  {
    name: "description",
    type: "string",
    description: "Optional subtitle or intro text.",
  },
  {
    name: "questions",
    type: "Question[]",
    required: true,
    description: "Array of single-choice or multiple-choice questions.",
  },
];

export const QUESTION_TYPES: ApiRow[] = [
  {
    name: "single-choice",
    type: "SingleChoiceQuestion",
    description: "One correct option. Uses correctAnswer: string (option id).",
  },
  {
    name: "multiple-choice",
    type: "MultipleChoiceQuestion",
    description: "Multiple correct options. Uses correctAnswers: string[] (exact set match).",
  },
];

export const QUIZ_EVENTS: ApiRow[] = [
  { name: "quiz:started", type: "event", description: "Quiz session began." },
  { name: "quiz:restarted", type: "event", description: "Quiz was reset and restarted." },
  { name: "question:viewed", type: "event", description: "User navigated to a question." },
  { name: "answer:selected", type: "event", description: "User selected or changed an answer." },
  { name: "question:answered", type: "event", description: "Question has a complete answer." },
  { name: "navigation:next", type: "event", description: "User moved to the next question." },
  { name: "navigation:previous", type: "event", description: "User moved to the previous question." },
  { name: "quiz:submitted", type: "event", description: "User submitted the quiz." },
  { name: "quiz:completed", type: "event", description: "Quiz finished with scored result in payload." },
];
