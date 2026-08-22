import type { UseQuizEngineReturn } from "../hooks/useQuizEngine";
import styles from "../styles/quiz.module.css";
import { Navigation } from "./Navigation";
import { ProgressBar } from "./ProgressBar";
import { QuestionView } from "./QuestionView";
import { QuizHeader } from "./QuizHeader";
import { ResultView } from "./ResultView";
import { StartScreen } from "./StartScreen";

interface QuizShellProps extends UseQuizEngineReturn {
  className?: string;
  autoStart?: boolean;
}

export function QuizShell({
  className,
  autoStart = false,
  state,
  result,
  currentQuestion,
  definition,
  config,
  actions,
  canGoNext,
  canGoPrevious,
  canSubmit,
}: QuizShellProps) {
  const rootClassName = className ? `${styles.root} ${className}` : styles.root;
  const totalQuestions = state.questionOrder.length;
  const isLastQuestion = state.currentQuestionIndex >= totalQuestions - 1;
  const isFirstQuestion = state.currentQuestionIndex === 0;

  return (
    <section className={rootClassName} aria-labelledby="quiz-title">
      <QuizHeader definition={definition} />

      {state.status === "not_started" && !autoStart ? (
        <StartScreen onStart={actions.start} />
      ) : null}

      {state.status === "in_progress" && currentQuestion ? (
        <>
          <ProgressBar
            currentIndex={state.currentQuestionIndex}
            total={totalQuestions}
          />
          <QuestionView
            question={currentQuestion}
            optionOrder={state.optionOrder[currentQuestion.id] ?? []}
            answer={state.answers[currentQuestion.id]}
            onAnswer={(value) => actions.answer(currentQuestion.id, value)}
          />
          <Navigation
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            canSubmit={canSubmit}
            onPrevious={actions.previous}
            onNext={actions.next}
            onSubmit={actions.submit}
          />
        </>
      ) : null}

      {state.status === "completed" && result ? (
        <ResultView
          result={result}
          showPercentage={config.showPercentage}
          onRestart={actions.restart}
        />
      ) : null}
    </section>
  );
}
