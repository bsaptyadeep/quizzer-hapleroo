import type { QuizResult } from "hapleroo-quizzard-core";
import styles from "../styles/quiz.module.css";

interface ResultViewProps {
  result: QuizResult;
  showPercentage: boolean;
  onRestart: () => void;
  restartLabel?: string;
  hideRestart?: boolean;
}

export function ResultView({
  result,
  showPercentage,
  onRestart,
  restartLabel = "Restart Quiz",
  hideRestart = false,
}: ResultViewProps) {
  return (
    <div className={styles.result}>
      <p className={styles.resultScore} aria-live="polite">
        You scored {result.score} out of {result.maxScore}
        {showPercentage ? ` (${result.percentage}%)` : ""}
      </p>
      <p className={styles.resultDetail}>
        Quiz complete in {Math.round(result.durationMs / 1000)} seconds.
      </p>
      {!hideRestart ? (
        <button type="button" className={styles.buttonPrimary} onClick={onRestart}>
          {restartLabel}
        </button>
      ) : null}
    </div>
  );
}
