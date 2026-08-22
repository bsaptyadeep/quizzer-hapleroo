import {
  isMultipleChoiceQuestion,
  isSingleChoiceQuestion,
  type AnswerValue,
  type Question,
} from "hapleroo-quizzard-core";
import styles from "../styles/quiz.module.css";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { SingleChoiceOptions } from "./SingleChoiceOptions";

interface QuestionViewProps {
  question: Question;
  optionOrder: string[];
  answer: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
}

export function QuestionView({
  question,
  optionOrder,
  answer,
  onAnswer,
}: QuestionViewProps) {
  return (
    <div className={styles.question}>
      <p className={styles.questionText}>{question.question}</p>
      {isSingleChoiceQuestion(question) ? (
        <SingleChoiceOptions
          question={question}
          optionOrder={optionOrder}
          selectedOptionId={
            answer?.type === "single-choice" ? answer.selectedOptionId : null
          }
          onChange={onAnswer}
        />
      ) : null}
      {isMultipleChoiceQuestion(question) ? (
        <MultipleChoiceOptions
          question={question}
          optionOrder={optionOrder}
          selectedOptionIds={
            answer?.type === "multiple-choice" ? answer.selectedOptionIds : []
          }
          onChange={onAnswer}
        />
      ) : null}
    </div>
  );
}
