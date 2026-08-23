import { QuizShell } from "./components/QuizShell";
import { useQuizEngine } from "./hooks/useQuizEngine";
import type { QuizProps } from "./types/props";

export function Quiz({
  quiz,
  config,
  className,
  autoStart,
  finishPage,
  renderFinishPage,
  onStart,
  onAnswer,
  onComplete,
  onEvent,
}: QuizProps) {
  const engineState = useQuizEngine({
    quiz,
    config,
    autoStart,
    onStart,
    onAnswer,
    onComplete,
    onEvent,
  });

  return (
    <QuizShell
      {...engineState}
      className={className}
      autoStart={autoStart}
      finishPage={finishPage}
      renderFinishPage={renderFinishPage}
    />
  );
}
