import type { QuizDefinition } from "hapleroo-quizzard-core";
import styles from "../styles/quiz.module.css";

interface QuizHeaderProps {
  definition: QuizDefinition;
}

export function QuizHeader({ definition }: QuizHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 id="quiz-title" className={styles.title}>
        {definition.title}
      </h1>
      {definition.description ? (
        <p className={styles.description}>{definition.description}</p>
      ) : null}
    </header>
  );
}
