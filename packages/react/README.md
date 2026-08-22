# hapleroo-quizzard

React UI for [Hapleroo Quizzard](https://www.npmjs.com/package/hapleroo-quizzard-core) — a drop-in `<Quiz />` component, `useQuizEngine` hook, and default stylesheet.

[![npm version](https://img.shields.io/npm/v/hapleroo-quizzard.svg)](https://www.npmjs.com/package/hapleroo-quizzard)

---

## Installation

Both packages are required for the React UI:

```bash
pnpm add hapleroo-quizzard hapleroo-quizzard-core
```

```bash
npm install hapleroo-quizzard hapleroo-quizzard-core
```

**Peer dependencies:** React 18+ and React DOM 18+

---

## Quick start

```tsx
import { Quiz } from "hapleroo-quizzard";
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
      config={{ allowBackNavigation: true }}
      onComplete={(result) => console.log("Score:", result.percentage + "%")}
      onEvent={(event) => console.log(event.type, event.payload)}
      className="my-quiz-theme"
    />
  );
}
```

---

## `<Quiz />` props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `quiz` | `QuizDefinition` | Yes | Quiz definition including id, title, and questions |
| `config` | `QuizConfig` | No | Behavior settings (shuffling, navigation, scoring) |
| `className` | `string` | No | CSS class applied to the quiz root for theming |
| `autoStart` | `boolean` | No | Skip the start screen (default: `false`) |
| `onStart` | `() => void` | No | Called when the user starts the quiz |
| `onAnswer` | `({ questionId, value }) => void` | No | Called when the user selects or changes an answer |
| `onComplete` | `(result: QuizResult) => void` | No | Called when the quiz is submitted with the final result |
| `onEvent` | `(event: QuizEvent) => void` | No | Called for every engine event |

Types `QuizDefinition`, `QuizConfig`, `QuizResult`, and `QuizEvent` are exported from `hapleroo-quizzard-core` and re-exported from `hapleroo-quizzard`.

---

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `shuffleQuestions` | `boolean` | `false` | Randomize question order when the quiz starts |
| `shuffleOptions` | `boolean` | `false` | Randomize option order for each question |
| `allowBackNavigation` | `boolean` | `true` | Allow navigating to previous questions |
| `requireAnswerToProceed` | `boolean` | `true` | Disable Next until the current question has an answer |
| `showPercentage` | `boolean` | `true` | Show percentage on the result screen |
| `pointsPerQuestion` | `number` | `1` | Points awarded per correctly answered question |

---

## Custom UI with `useQuizEngine`

Use the hook when you need full control over rendering:

```tsx
import { useQuizEngine } from "hapleroo-quizzard";
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
}
```

### Hook return value

| Property | Description |
| --- | --- |
| `state` | Current `QuizState` (status, index, answers) |
| `currentQuestion` | Active question object or `null` |
| `result` | Final `QuizResult` after completion, or `null` |
| `actions` | `start`, `answer`, `next`, `previous`, `submit`, `restart` |
| `canGoNext` | Whether Next navigation is allowed |
| `canGoPrevious` | Whether Back navigation is allowed |
| `canSubmit` | Whether Submit is allowed |

---

## Theming

Import the default styles once in your app:

```tsx
import "hapleroo-quizzard/styles.css";
```

Override CSS custom properties on the class you pass to `<Quiz />`:

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

No JavaScript theme API is needed — all styling is done through CSS variables.

---

## Events

Pass `onEvent` to receive typed engine events:

| Event | Description |
| --- | --- |
| `quiz:started` | Quiz session began |
| `quiz:restarted` | Quiz was reset |
| `question:viewed` | User navigated to a question |
| `answer:selected` | User selected or changed an answer |
| `question:answered` | Question has a complete answer |
| `navigation:next` | Moved to next question |
| `navigation:previous` | Moved to previous question |
| `quiz:submitted` | User submitted the quiz |
| `quiz:completed` | Quiz finished with result in payload |

---

## Exports

```typescript
export { Quiz } from "hapleroo-quizzard";
export { useQuizEngine } from "hapleroo-quizzard";
export type { QuizProps } from "hapleroo-quizzard";
export type { UseQuizEngineOptions, UseQuizEngineReturn } from "hapleroo-quizzard";

// Re-exported from hapleroo-quizzard-core:
export type {
  AnswerValue,
  QuizConfig,
  QuizDefinition,
  QuizEvent,
  QuizResult,
} from "hapleroo-quizzard";
```

---

## Headless engine

For validation, scoring, or non-React usage, see **[hapleroo-quizzard-core](https://www.npmjs.com/package/hapleroo-quizzard-core)**.
