# hapleroo-quizzard-core

Framework-agnostic quiz engine for [Hapleroo Quizzard](https://www.npmjs.com/package/hapleroo-quizzard) — validation, state machine, scoring, and typed events. Use it standalone or with the React adapter.

[![npm version](https://img.shields.io/npm/v/hapleroo-quizzard-core.svg)](https://www.npmjs.com/package/hapleroo-quizzard-core)

---

## Installation

```bash
pnpm add hapleroo-quizzard-core
```

```bash
npm install hapleroo-quizzard-core
```

For the React UI, install **[hapleroo-quizzard](https://www.npmjs.com/package/hapleroo-quizzard)** instead (it includes this package as a dependency).

---

## Quick start

```typescript
import { createQuizEngine } from "hapleroo-quizzard-core";
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

const engine = createQuizEngine(quiz, {
  allowBackNavigation: true,
  shuffleOptions: false,
});

engine.subscribeToState((state) => {
  console.log("Status:", state.status, "Index:", state.currentIndex);
});

engine.subscribe((event) => {
  console.log(event.type, event.payload);
});

engine.start();
engine.answer("q1", "b");
engine.next();
const result = engine.submit();

console.log(result.score, "/", result.maxScore, `(${result.percentage}%)`);
```

---

## Quiz engine API

### `createQuizEngine(definition, config?, options?)`

Creates a quiz engine instance. The definition is validated on creation.

### Methods

| Method | Description |
| --- | --- |
| `start()` | Begin the quiz (applies shuffling if configured) |
| `answer(questionId, value)` | Record an answer for a question |
| `next()` | Navigate to the next question |
| `previous()` | Navigate to the previous question |
| `goTo(index)` | Jump to a question by index |
| `submit()` | Submit the quiz and return the scored `QuizResult` |
| `restart()` | Reset the quiz to idle state |
| `getState()` | Get current `QuizState` |
| `getResult()` | Get result after completion, or `null` |
| `getCurrentQuestion()` | Get the active question object |
| `canGoNext()` | Whether next navigation is allowed |
| `canGoPrevious()` | Whether back navigation is allowed |
| `canSubmit()` | Whether submit is allowed |
| `isAnswered(questionId)` | Whether a question has an answer |
| `subscribe(listener)` | Subscribe to `QuizEvent` emissions |
| `subscribeToState(listener)` | Subscribe to state changes |

---

## Quiz definition

```typescript
interface QuizDefinition {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}
```

### Question types

**Single-choice** — one correct option:

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
  correctAnswer: "b",
}
```

**Multiple-choice** — exact set match required:

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
  correctAnswers: ["a", "c"],
}
```

---

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `shuffleQuestions` | `boolean` | `false` | Randomize question order on start |
| `shuffleOptions` | `boolean` | `false` | Randomize option order per question |
| `allowBackNavigation` | `boolean` | `true` | Allow navigating to previous questions |
| `requireAnswerToProceed` | `boolean` | `true` | Block next until current question is answered |
| `showPercentage` | `boolean` | `true` | Include percentage in results |
| `pointsPerQuestion` | `number` | `1` | Points per correct question |

```typescript
import { DEFAULT_QUIZ_CONFIG, resolveQuizConfig } from "hapleroo-quizzard-core";

const config = resolveQuizConfig({ shuffleQuestions: true });
```

---

## Validation

Validate quiz definitions and config before runtime:

```typescript
import { validateQuizDefinition, validateQuizConfig } from "hapleroo-quizzard-core";

const quizResult = validateQuizDefinition(maybeQuiz);

if (!quizResult.success) {
  for (const issue of quizResult.issues) {
    console.error(issue.path, issue.message);
  }
} else {
  const quiz = quizResult.data;
}

const configResult = validateQuizConfig({ pointsPerQuestion: 2 });
```

Throw on invalid input:

```typescript
import { assertValidQuizDefinition } from "hapleroo-quizzard-core";

assertValidQuizDefinition(maybeQuiz); // throws QuizValidationError
```

---

## Scoring

```typescript
import {
  evaluateQuestion,
  evaluateAllQuestions,
  calculateScore,
  buildQuizResult,
} from "hapleroo-quizzard-core";

const answers = { q1: "b", q2: ["a", "c"] };
const questionResults = evaluateAllQuestions(quiz, answers, 1);
const summary = calculateScore(questionResults);
const result = buildQuizResult({
  quizId: quiz.id,
  questionResults,
  startedAt: Date.now() - 60000,
  completedAt: Date.now(),
});
```

### `QuizResult` shape

```typescript
interface QuizResult {
  quizId: string;
  score: number;
  maxScore: number;
  percentage: number;
  questionResults: QuestionResult[];
  startedAt: number;
  completedAt: number;
  durationMs: number;
}
```

---

## Events

Subscribe via `engine.subscribe()`:

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

## Main exports

```typescript
// Engine
export { createQuizEngine } from "hapleroo-quizzard-core";

// Validation
export {
  validateQuizDefinition,
  validateQuizConfig,
  assertValidQuizDefinition,
  assertValidQuizConfig,
  QuizValidationError,
} from "hapleroo-quizzard-core";

// Evaluation & scoring
export {
  evaluateQuestion,
  calculateScore,
  evaluateAllQuestions,
  buildQuizResult,
} from "hapleroo-quizzard-core";

// Types
export type {
  QuizDefinition,
  QuizConfig,
  QuizState,
  QuizResult,
  QuizEvent,
  Question,
  AnswerValue,
} from "hapleroo-quizzard-core";

// Type guards
export {
  isSingleChoiceQuestion,
  isMultipleChoiceQuestion,
} from "hapleroo-quizzard-core";
```

---

## React UI

For a drop-in `<Quiz />` component and `useQuizEngine` hook, see **[hapleroo-quizzard](https://www.npmjs.com/package/hapleroo-quizzard)**.
