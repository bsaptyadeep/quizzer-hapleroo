import type { MultipleChoiceQuestion } from "@quiz/core";
import type { AnswerValue } from "@quiz/core";
import styles from "../styles/quiz.module.css";

interface MultipleChoiceOptionsProps {
  question: MultipleChoiceQuestion;
  optionOrder: string[];
  selectedOptionIds: string[];
  onChange: (value: AnswerValue) => void;
}

export function MultipleChoiceOptions({
  question,
  optionOrder,
  selectedOptionIds,
  onChange,
}: MultipleChoiceOptionsProps) {
  const optionsById = new Map(question.options.map((option) => [option.id, option]));
  const selectedSet = new Set(selectedOptionIds);

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
                type="checkbox"
                value={option.id}
                checked={selectedSet.has(option.id)}
                onChange={() => {
                  const nextSelected = selectedSet.has(option.id)
                    ? selectedOptionIds.filter((id) => id !== option.id)
                    : [...selectedOptionIds, option.id];

                  onChange({
                    type: "multiple-choice",
                    selectedOptionIds: nextSelected,
                  });
                }}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
