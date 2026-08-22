export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do I need both hapleroo-quizzard and hapleroo-quizzard-core?",
    answer:
      "If you use the React <Quiz /> component or useQuizEngine hook, install both packages. hapleroo-quizzard depends on hapleroo-quizzard-core for types and the engine. If you only need the headless engine (vanilla JS, Vue, etc.), hapleroo-quizzard-core alone is sufficient.",
  },
  {
    question: "Can I use the engine without React?",
    answer:
      "Yes. hapleroo-quizzard-core is framework-agnostic. Use createQuizEngine() to manage quiz state, subscribe to changes, and handle navigation and scoring in any JavaScript environment.",
  },
  {
    question: "How do I customize styling?",
    answer:
      "Import hapleroo-quizzard/styles.css for defaults, then pass a className to <Quiz /> and override CSS custom properties such as --quiz-color-primary, --quiz-color-bg, and --quiz-radius on that wrapper.",
  },
  {
    question: "What events does onEvent emit?",
    answer:
      "Events include quiz:started, quiz:restarted, question:viewed, answer:selected, question:answered, navigation:next, navigation:previous, quiz:submitted, and quiz:completed. Each event has a timestamp and typed payload.",
  },
  {
    question: "How is scoring calculated?",
    answer:
      "Each question is evaluated against its correct answer(s). Single-choice questions match one option ID; multiple-choice questions require an exact set match. The final score includes correct count, total, percentage, and per-question results.",
  },
  {
    question: "Can users go back to previous questions?",
    answer:
      "Yes, when allowBackNavigation is true in QuizConfig (default). Set it to false to enforce forward-only navigation.",
  },
  {
    question: "How do I validate my quiz JSON before runtime?",
    answer:
      "Use validateQuizDefinition() from hapleroo-quizzard-core. It returns { success: true, data } or { success: false, issues } with path, code, and message for each validation problem.",
  },
  {
    question: "Does it work with SSR / Next.js?",
    answer:
      "The engine and React hook work in SSR environments. Import styles on the client or in your global CSS. Avoid calling browser-only APIs during server render; mount <Quiz /> in a client component.",
  },
];
