import styles from "../styles/quiz.module.css";

interface ProgressBarProps {
  currentIndex: number;
  total: number;
}

export function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  const current = total > 0 ? currentIndex + 1 : 0;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={styles.progress}>
      <span className={styles.progressLabel}>
        Question {current} of {total}
      </span>
      <div
        role="progressbar"
        aria-label={`Question ${current} of ${total}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        className={styles.progressTrack}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
