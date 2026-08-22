export const INSTALL_COMMAND = "pnpm add hapleroo-quizzard hapleroo-quizzard-core";

export const QUICK_START_STEPS = [
  {
    title: "Install packages",
    description: "Add the React UI adapter and the headless engine to your project.",
    code: INSTALL_COMMAND,
  },
  {
    title: "Import styles",
    description: "Include the default quiz stylesheet once in your app entry point.",
    code: 'import "hapleroo-quizzard/styles.css";',
  },
  {
    title: "Render the quiz",
    description: "Pass a quiz definition and handle completion with callbacks.",
    code: `<Quiz quiz={definition} onComplete={(result) => console.log(result)} />`,
  },
] as const;

export const DOC_TABS = [
  { id: "react", label: "React Component" },
  { id: "hook", label: "useQuizEngine" },
  { id: "engine", label: "Headless Engine" },
  { id: "json", label: "Quiz JSON" },
] as const;

export type DocTabId = (typeof DOC_TABS)[number]["id"];

export const CODE_EXAMPLES: Record<DocTabId, { language: string; code: string }> = {
  react: {
    language: "tsx",
    code: `import { Quiz } from "hapleroo-quizzard";
import "hapleroo-quizzard/styles.css";
import type { QuizDefinition } from "hapleroo-quizzard-core";

const quiz: QuizDefinition = {
  id: "my-quiz",
  title: "JavaScript Basics",
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

export function QuizPage() {
  return (
    <Quiz
      quiz={quiz}
      config={{ allowBackNavigation: true, shuffleQuestions: false }}
      onComplete={(result) => console.log("Score:", result.percentage + "%")}
      onEvent={(event) => console.log(event.type, event.payload)}
      className="my-quiz-theme"
    />
  );
}`,
  },
  hook: {
    language: "tsx",
    code: `import { useQuizEngine } from "hapleroo-quizzard";
import type { QuizDefinition } from "hapleroo-quizzard-core";

function CustomQuiz({ quiz }: { quiz: QuizDefinition }) {
  const {
    state,
    currentQuestion,
    actions,
    canGoNext,
    canGoPrevious,
    canSubmit,
    result,
  } = useQuizEngine({
    quiz,
    config: { requireAnswerToProceed: true },
    onComplete: (result) => console.log(result),
    onEvent: (event) => console.log(event),
  });

  if (state.status === "idle") {
    return <button onClick={actions.start}>Start</button>;
  }

  if (state.status === "completed" && result) {
    return <p>Score: {result.percentage}%</p>;
  }

  return (
    <div>
      <p>{currentQuestion?.question}</p>
      {/* Render your own option UI */}
      <button onClick={actions.next} disabled={!canGoNext}>Next</button>
      <button onClick={actions.previous} disabled={!canGoPrevious}>Back</button>
      <button onClick={actions.submit} disabled={!canSubmit}>Submit</button>
    </div>
  );
}`,
  },
  engine: {
    language: "typescript",
    code: `import {
  createQuizEngine,
  validateQuizDefinition,
} from "hapleroo-quizzard-core";

const validation = validateQuizDefinition(quizDefinition);
if (!validation.success) {
  throw new Error(validation.issues.map((i) => i.message).join("; "));
}

const engine = createQuizEngine(quizDefinition, {
  allowBackNavigation: true,
  shuffleOptions: true,
});

engine.subscribeToState((state) => {
  console.log("Status:", state.status, "Index:", state.currentIndex);
});

engine.start();
engine.answer("q1", "b");
engine.next();
const result = engine.submit();

console.log(result.score, "/", result.maxScore, "(" + result.percentage + "%)");`,
  },
  json: {
    language: "json",
    code: `{
  "id": "mixed-quiz",
  "title": "Mixed Quiz",
  "description": "Single and multiple choice questions",
  "questions": [
    {
      "id": "q1",
      "type": "single-choice",
      "question": "What is 2 + 2?",
      "options": [
        { "id": "a", "label": "3" },
        { "id": "b", "label": "4" },
        { "id": "c", "label": "5" }
      ],
      "correctAnswer": "b"
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "Select all vowels:",
      "options": [
        { "id": "a", "label": "a" },
        { "id": "b", "label": "b" },
        { "id": "c", "label": "e" },
        { "id": "d", "label": "z" }
      ],
      "correctAnswers": ["a", "c"]
    }
  ]
}`,
  },
};

export const THEME_PRESETS = [
  {
    id: "default",
    label: "Default",
    className: "quiz-theme-default",
    css: `/* Uses hapleroo-quizzard default tokens */`,
  },
  {
    id: "dark",
    label: "Dark",
    className: "quiz-theme-dark",
    css: `.my-quiz-theme {
  --quiz-color-primary: #818cf8;
  --quiz-color-text: #f1f5f9;
  --quiz-color-bg: #1e293b;
  --quiz-color-border: #475569;
  --quiz-color-muted: #94a3b8;
  --quiz-color-correct: #4ade80;
  --quiz-color-focus: #818cf8;
}`,
  },
  {
    id: "brand",
    label: "Brand",
    className: "quiz-theme-brand",
    css: `.my-quiz-theme {
  --quiz-color-primary: #7c3aed;
  --quiz-color-text: #1e1b4b;
  --quiz-color-bg: #faf5ff;
  --quiz-color-border: #ddd6fe;
  --quiz-color-muted: #6b7280;
  --quiz-color-correct: #059669;
  --quiz-color-focus: #7c3aed;
  --quiz-radius: 12px;
}`,
  },
] as const;

export type ThemePresetId = (typeof THEME_PRESETS)[number]["id"];
