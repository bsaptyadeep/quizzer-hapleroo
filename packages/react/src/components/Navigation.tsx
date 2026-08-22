import styles from "../styles/quiz.module.css";

interface NavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  canSubmit: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function Navigation({
  isFirstQuestion,
  isLastQuestion,
  canGoPrevious,
  canGoNext,
  canSubmit,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationProps) {
  return (
    <div className={styles.navigation}>
      <button
        type="button"
        className={styles.button}
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-hidden={isFirstQuestion}
        style={isFirstQuestion ? { visibility: "hidden" } : undefined}
      >
        Previous
      </button>

      {isLastQuestion ? (
        <button
          type="button"
          className={styles.buttonPrimary}
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          Submit
        </button>
      ) : (
        <button
          type="button"
          className={styles.buttonPrimary}
          onClick={onNext}
          disabled={!canGoNext}
        >
          Next
        </button>
      )}
    </div>
  );
}
