import styles from "../styles/quiz.module.css";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className={styles.startScreen}>
      <button type="button" className={styles.buttonPrimary} onClick={onStart}>
        Start Quiz
      </button>
    </div>
  );
}
