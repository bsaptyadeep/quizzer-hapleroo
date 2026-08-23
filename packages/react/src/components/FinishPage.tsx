import type { QuizDefinition, QuizResult } from "hapleroo-quizzard-core";
import type { FinishPageConfig } from "../types/finish-page";
import { resolveFinishPageContent } from "../utils/resolve-finish-page-content";
import styles from "../styles/quiz.module.css";
import { QuestionBreakdown } from "./QuestionBreakdown";
import { ResultView } from "./ResultView";
import { ScoreRing } from "./ScoreRing";

interface FinishPageProps {
  result: QuizResult;
  definition: QuizDefinition;
  finishPage?: FinishPageConfig;
  showPercentageFromConfig: boolean;
  onRestart: () => void;
}

export function FinishPage({
  result,
  definition,
  finishPage,
  showPercentageFromConfig,
  onRestart,
}: FinishPageProps) {
  const variant = finishPage?.variant ?? "default";

  if (variant === "minimal") {
    const showPercentage = finishPage?.showPercentage ?? showPercentageFromConfig;
    return (
      <div className={finishPage?.className}>
        <ResultView
          result={result}
          showPercentage={showPercentage}
          onRestart={onRestart}
          restartLabel={finishPage?.restartLabel}
          hideRestart={finishPage?.hideRestart}
        />
      </div>
    );
  }

  const { title, subtitle } = resolveFinishPageContent(finishPage, result);
  const showScore = finishPage?.showScore ?? true;
  const showPercentage = finishPage?.showPercentage ?? showPercentageFromConfig;
  const showDuration = finishPage?.showDuration ?? true;
  const showQuestionBreakdown = finishPage?.showQuestionBreakdown ?? false;
  const restartLabel = finishPage?.restartLabel ?? "Try Again";
  const hideRestart = finishPage?.hideRestart ?? false;

  const stats: string[] = [];
  if (showScore) {
    stats.push(`${result.score}/${result.maxScore}`);
  }
  if (showPercentage) {
    stats.push(`${result.percentage}%`);
  }
  if (showDuration) {
    stats.push(`${Math.round(result.durationMs / 1000)}s`);
  }

  const rootClassName = finishPage?.className
    ? `${styles.finishPage} ${finishPage.className}`
    : styles.finishPage;

  return (
    <div className={rootClassName} aria-live="polite">
      <ScoreRing percentage={result.percentage} />

      <h2 className={styles.tierTitle}>{title}</h2>
      {subtitle ? <p className={styles.tierSubtitle}>{subtitle}</p> : null}

      {stats.length > 0 ? (
        <p className={styles.statsRow}>{stats.join(" · ")}</p>
      ) : null}

      {showQuestionBreakdown ? (
        <QuestionBreakdown result={result} definition={definition} />
      ) : null}

      {!hideRestart ? (
        <button type="button" className={styles.buttonPrimary} onClick={onRestart}>
          {restartLabel}
        </button>
      ) : null}
    </div>
  );
}
