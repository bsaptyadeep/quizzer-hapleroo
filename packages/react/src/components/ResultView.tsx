import type { QuizResult } from "hapleroo-quizzard-core";
import styles from "../styles/quiz.module.css";

interface ResultViewProps {
  result: QuizResult;
  showPercentage: boolean;
  onRestart: () => void;
}

export function ResultView({ result, showPercentage, onRestart }: ResultViewProps) {
  return (
    <div className={styles.result}>
      <p className={styles.resultScore} aria-live="polite">
        You scored {result.score} out of {result.maxScore}
        {showPercentage ? ` (${result.percentage}%)` : ""}
      </p>
      <p className={styles.resultDetail}>
        Quiz complete in {Math.round(result.durationMs / 1000)} seconds.
      </p>
      <button type="button" className={styles.buttonPrimary} onClick={onRestart}>
        Restart Quiz
      </button>
    </div>
  );
}
