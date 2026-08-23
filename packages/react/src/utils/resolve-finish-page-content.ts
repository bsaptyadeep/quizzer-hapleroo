import type { QuizResult } from "hapleroo-quizzard-core";
import type { FinishPageConfig, FinishPageTier } from "../types/finish-page";

export const DEFAULT_FINISH_PAGE_TIERS: FinishPageTier[] = [
  {
    minPercentage: 100,
    title: "Perfect score!",
    subtitle: "You nailed every question.",
  },
  {
    minPercentage: 80,
    title: "Great job!",
    subtitle: "Strong performance — keep it up.",
  },
  {
    minPercentage: 50,
    title: "Good effort",
    subtitle: "Review the breakdown and try again.",
  },
  {
    minPercentage: 0,
    title: "Keep practicing",
    subtitle: "Every attempt makes you better.",
  },
];

function resolveText(
  value: string | ((result: QuizResult) => string) | undefined,
  result: QuizResult,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "function" ? value(result) : value;
}

function matchTier(tiers: FinishPageTier[], percentage: number): FinishPageTier {
  const sorted = [...tiers].sort((a, b) => b.minPercentage - a.minPercentage);
  return sorted.find((tier) => percentage >= tier.minPercentage) ?? sorted[sorted.length - 1]!;
}

export interface ResolvedFinishPageContent {
  title: string;
  subtitle?: string;
  tier: FinishPageTier;
}

export function resolveFinishPageContent(
  config: FinishPageConfig | undefined,
  result: QuizResult,
): ResolvedFinishPageContent {
  const tiers = config?.tiers ?? DEFAULT_FINISH_PAGE_TIERS;
  const tier = matchTier(tiers, result.percentage);

  const title =
    resolveText(config?.title, result) ??
    tier.title ??
    `You scored ${result.score} out of ${result.maxScore}`;

  const subtitle = resolveText(config?.subtitle, result) ?? tier.subtitle;

  return { title, subtitle, tier };
}
