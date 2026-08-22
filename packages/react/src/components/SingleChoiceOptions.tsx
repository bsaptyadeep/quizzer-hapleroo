import type { SingleChoiceQuestion } from "hapleroo-quizzard-core";
import type { AnswerValue } from "hapleroo-quizzard-core";
import styles from "../styles/quiz.module.css";

interface SingleChoiceOptionsProps {
  question: SingleChoiceQuestion;
  optionOrder: string[];
  selectedOptionId: string | null;
  onChange: (value: AnswerValue) => void;
}

export function SingleChoiceOptions({
  question,
  optionOrder,
  selectedOptionId,
  onChange,
}: SingleChoiceOptionsProps) {
  const optionsById = new Map(question.options.map((option) => [option.id, option]));

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Answer options</legend>
      <div className={styles.options}>
        {optionOrder.map((optionId) => {
          const option = optionsById.get(optionId);
          if (!option) {
            return null;
          }

          const inputId = `${question.id}-${option.id}`;

          return (
            <label key={option.id} className={styles.option} htmlFor={inputId}>
              <input
                id={inputId}
                type="radio"
                name={question.id}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() =>
                  onChange({
                    type: "single-choice",
                    selectedOptionId: option.id,
                  })
                }
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
