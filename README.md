# Hapleroo Quizzard

**Embeddable, typed quiz engine for React and beyond.**

Ship single-choice and multiple-choice quizzes with a drop-in React component, a headless state machine, validation, scoring, and CSS-variable theming — no backend required.

[![npm version](https://img.shields.io/npm/v/hapleroo-quizzard.svg)](https://www.npmjs.com/package/hapleroo-quizzard)
[![npm version](https://img.shields.io/npm/v/hapleroo-quizzard-core.svg)](https://www.npmjs.com/package/hapleroo-quizzard-core)

---

## Features

- **Headless engine** — Framework-agnostic quiz logic in `hapleroo-quizzard-core`
- **Drop-in React UI** — `<Quiz />` component and `useQuizEngine` hook
- **Question types** — Single-choice and multiple-choice with exact-set scoring
- **Configurable behavior** — Shuffling, back navigation, required answers, scoring
- **Typed events** — Subscribe to navigation, answers, and completion via `onEvent`
- **CSS theming** — Override `--quiz-color-*` variables on a wrapper class
- **Runtime validation** — Validate quiz JSON before your app goes live

---

## Packages

| Package | Description | Install |
| --- | --- | --- |
| [`hapleroo-quizzard`](https://www.npmjs.com/package/hapleroo-quizzard) | React `<Quiz />` component + `useQuizEngine` hook | `pnpm add hapleroo-quizzard hapleroo-quizzard-core` |
| [`hapleroo-quizzard-core`](https://www.npmjs.com/package/hapleroo-quizzard-core) | Framework-agnostic engine, validation, scoring | `pnpm add hapleroo-quizzard-core` |

Package-specific docs:

- [React package README](./packages/react/README.md)
- [Core package README](./packages/core/README.md)

---

## Installation

```bash
pnpm add hapleroo-quizzard hapleroo-quizzard-core
```

```bash
npm install hapleroo-quizzard hapleroo-quizzard-core
```

For headless-only usage (no React UI):

```bash
pnpm add hapleroo-quizzard-core
```

---

## Quick start

```tsx
import { Quiz } from "hapleroo-quizzard";
import "hapleroo-quizzard/styles.css";
import type { QuizDefinition } from "hapleroo-quizzard-core";

const quiz: QuizDefinition = {
  id: "js-basics",
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
      onComplete={(result) => console.log(`${result.percentage}%`)}
    />
  );
}
```

### Skip start screen

By default, the quiz shows a "Start Quiz" button before the first question. Pass `autoStart` to open directly on question 1:

```tsx
<Quiz quiz={quiz} autoStart onComplete={(result) => console.log(result)} />
```

This also applies after restart — the quiz returns to the first question instead of the start screen.

### Finish page

Configure the result screen via `finishPage` or supply a custom `renderFinishPage`:

```tsx
<Quiz
  quiz={quiz}
  finishPage={{
    showQuestionBreakdown: true,
    restartLabel: "Play again",
  }}
/>
```

Use `finishPage={{ variant: "minimal" }}` for the legacy simple layout.

---

## Quiz definition

A quiz is a plain JSON/TypeScript object:

```typescript
interface QuizDefinition {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}
```

### Single-choice question

```typescript
{
  id: "q1",
  type: "single-choice",
  question: "What is 2 + 2?",
  options: [
    { id: "a", label: "3" },
    { id: "b", label: "4" },
    { id: "c", label: "5" },
  ],
  correctAnswer: "b", // option id
}
```

### Multiple-choice question

```typescript
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
  correctAnswers: ["a", "c"], // exact set match required
}
```

---

## Configuration

Pass optional settings via the `config` prop on `<Quiz />` or to `createQuizEngine()`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `shuffleQuestions` | `boolean` | `false` | Randomize question order on start |
| `shuffleOptions` | `boolean` | `false` | Randomize option order per question |
| `allowBackNavigation` | `boolean` | `true` | Allow navigating to previous questions |
| `requireAnswerToProceed` | `boolean` | `true` | Disable Next until current question is answered |
| `showPercentage` | `boolean` | `true` | Show percentage on the result screen |
| `pointsPerQuestion` | `number` | `1` | Points awarded per correct question |

```tsx
<Quiz
  quiz={quiz}
  config={{
    shuffleQuestions: true,
    allowBackNavigation: false,
  }}
/>
```

---

## Theming

Import the default stylesheet, then override CSS custom properties on a wrapper class:

```tsx
<Quiz quiz={quiz} className="my-quiz-theme" />
```

```css
.my-quiz-theme {
  --quiz-color-primary: #7c3aed;
  --quiz-color-text: #1e1b4b;
  --quiz-color-bg: #faf5ff;
  --quiz-color-border: #ddd6fe;
  --quiz-color-muted: #6b7280;
  --quiz-color-correct: #059669;
  --quiz-color-focus: #7c3aed;
  --quiz-radius: 12px;
}
```

Available variables include `--quiz-color-primary`, `--quiz-color-text`, `--quiz-color-bg`, `--quiz-color-border`, `--quiz-color-muted`, `--quiz-color-correct`, `--quiz-color-focus`, and `--quiz-radius`.

---

## Advanced usage

### Custom UI with `useQuizEngine`

Build your own interface while the hook manages state:

```tsx
import { useQuizEngine } from "hapleroo-quizzard";

function CustomQuiz({ quiz }) {
  const { state, currentQuestion, actions, canGoNext, result } = useQuizEngine({
    quiz,
    onComplete: (result) => console.log(result),
  });

  if (state.status === "not_started") {
    return <button onClick={actions.start}>Start</button>;
  }

  if (state.status === "completed" && result) {
    return <p>Score: {result.percentage}%</p>;
  }

  return (
    <div>
      <p>{currentQuestion?.question}</p>
      <button onClick={actions.next} disabled={!canGoNext}>Next</button>
    </div>
  );
}
```

### Headless engine (no React)

Use the engine in any JavaScript environment:

```typescript
import { createQuizEngine } from "hapleroo-quizzard-core";

const engine = createQuizEngine(quizDefinition, {
  allowBackNavigation: true,
});

engine.subscribeToState((state) => {
  console.log(state.status, state.currentIndex);
});

engine.start();
engine.answer("q1", "b");
engine.next();
const result = engine.submit();
```

See the [core package README](./packages/core/README.md) for the full engine API.

---

## Events

Subscribe to all engine activity with `onEvent`:

```tsx
<Quiz
  quiz={quiz}
  onEvent={(event) => console.log(event.type, event.payload)}
/>
```

| Event | Description |
| --- | --- |
| `quiz:started` | Quiz session began |
| `quiz:restarted` | Quiz was reset and restarted |
| `question:viewed` | User navigated to a question |
| `answer:selected` | User selected or changed an answer |
| `question:answered` | Question has a complete answer |
| `navigation:next` | User moved to the next question |
| `navigation:previous` | User moved to the previous question |
| `quiz:submitted` | User submitted the quiz |
| `quiz:completed` | Quiz finished with scored result in payload |

Each event includes a `timestamp` and typed `payload`.

---

## Validation

Validate quiz definitions before runtime:

```typescript
import { validateQuizDefinition } from "hapleroo-quizzard-core";

const result = validateQuizDefinition(maybeQuiz);

if (!result.success) {
  console.error(result.issues);
  // [{ path: "questions[0].correctAnswer", code: "...", message: "..." }]
} else {
  const quiz = result.data;
}
```

---

## `<Quiz />` props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `quiz` | `QuizDefinition` | Yes | Quiz definition object |
| `config` | `QuizConfig` | No | Behavior settings |
| `className` | `string` | No | CSS class for theming via CSS variables |
| `autoStart` | `boolean` | No | Skip start screen, open on first question (default: `false`) |
| `onStart` | `() => void` | No | Called when quiz starts |
| `onAnswer` | `({ questionId, value }) => void` | No | Called when user answers |
| `onComplete` | `(result: QuizResult) => void` | No | Called with final scored result |
| `onEvent` | `(event: QuizEvent) => void` | No | Called for every engine event |

---

## Development

Clone the repo and run the interactive playground:

```bash
pnpm install
pnpm dev        # Start playground at http://localhost:5173
pnpm build      # Build all packages
pnpm test       # Run all tests
pnpm lint       # Lint
pnpm typecheck  # Type-check all packages
```

### Monorepo layout

```
hapleroo-quizzard/
├── packages/core/    # hapleroo-quizzard-core
├── packages/react/   # hapleroo-quizzard
└── apps/playground/  # Interactive docs + live demo
```

---

## Requirements

- **Node.js** 20+
- **React** 18+ (for `hapleroo-quizzard`)
