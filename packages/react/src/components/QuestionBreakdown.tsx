import type { QuizDefinition, QuizResult } from "hapleroo-quizzard-core";
import styles from "../styles/quiz.module.css";

interface QuestionBreakdownProps {
  result: QuizResult;
  definition: QuizDefinition;
}

export function QuestionBreakdown({ result, definition }: QuestionBreakdownProps) {
  const questionMap = new Map(definition.questions.map((q) => [q.id, q]));

  return (
    <div className={styles.breakdown}>
      <h3 className={styles.breakdownTitle}>Question breakdown</h3>
      <ul className={styles.breakdownList}>
        {result.questionResults.map((questionResult, index) => {
          const question = questionMap.get(questionResult.questionId);
          const label = question?.question ?? `Question ${index + 1}`;

          return (
            <li
              key={questionResult.questionId}
              className={`${styles.breakdownItem}${questionResult.isCorrect ? ` ${styles.breakdownItemCorrect}` : ` ${styles.breakdownItemIncorrect}`}`}
            >
              <span className={styles.breakdownIcon} aria-hidden="true">
                {questionResult.isCorrect ? "✓" : "✗"}
              </span>
              <span className={styles.breakdownText}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
