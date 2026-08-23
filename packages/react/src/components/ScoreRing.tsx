import styles from "../styles/quiz.module.css";

interface ScoreRingProps {
  percentage: number;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ percentage }: ScoreRingProps) {
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  return (
    <div className={styles.scoreRing} aria-hidden="true">
      <svg className={styles.scoreRingSvg} viewBox="0 0 120 120">
        <circle
          className={styles.scoreRingTrack}
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
        />
        <circle
          className={styles.scoreRingProgress}
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className={styles.scoreRingLabel}>{percentage}%</span>
    </div>
  );
}
