import type {
  MultipleChoiceQuestion,
  Question,
  QuestionType,
  SingleChoiceQuestion,
} from "../types/quiz-definition";
import type { ValidationIssue } from "./errors";
import {
  collectDuplicateIds,
  isNonEmptyString,
  isRecord,
  issue,
  optionIdSet,
} from "./helpers";
import { validateOptions } from "./validate-option";

const VALID_QUESTION_TYPES: QuestionType[] = [
  "single-choice",
  "multiple-choice",
];

export interface ValidateQuestionResult {
  issues: ValidationIssue[];
  question: Question | null;
}

export function validateQuestion(
  input: unknown,
  path: string,
): ValidateQuestionResult {
  const issues: ValidationIssue[] = [];

  if (!isRecord(input)) {
    issues.push(
      issue(path, "invalid_type", "Question must be an object."),
    );
    return { issues, question: null };
  }

  const idPath = `${path}.id`;
  const questionPath = `${path}.question`;
  const typePath = `${path}.type`;
  const optionsPath = `${path}.options`;

  if (!isNonEmptyString(input.id)) {
    issues.push(
      issue(idPath, "required", "Question id must be a non-empty string."),
    );
  }

  if (!isNonEmptyString(input.question)) {
    issues.push(
      issue(
        questionPath,
        "required",
        "Question text must be a non-empty string.",
      ),
    );
  }

  const questionType = input.type;
  const isValidType =
    typeof questionType === "string" &&
    VALID_QUESTION_TYPES.includes(questionType as QuestionType);

  if (!isValidType) {
    issues.push(
      issue(
        typePath,
        "invalid_enum",
        'Question type must be "single-choice" or "multiple-choice".',
      ),
    );
  }

  const { issues: optionIssues, options } = validateOptions(
    input.options,
    optionsPath,
  );
  issues.push(...optionIssues);

  const validOptionIds = optionIdSet(options);

  if (questionType === "single-choice") {
    validateSingleChoiceAnswer(input, path, validOptionIds, issues);
  } else if (questionType === "multiple-choice") {
    validateMultipleChoiceAnswers(input, path, validOptionIds, issues);
  }

  if (issues.length > 0 || !isValidType) {
    return { issues, question: null };
  }

  if (questionType === "single-choice") {
    return {
      issues,
      question: {
        id: input.id as string,
        type: "single-choice",
        question: input.question as string,
        options,
        correctAnswer: input.correctAnswer as string,
      } satisfies SingleChoiceQuestion,
    };
  }

  return {
    issues,
    question: {
      id: input.id as string,
      type: "multiple-choice",
      question: input.question as string,
      options,
      correctAnswers: (input.correctAnswers as unknown[]).filter(
        isNonEmptyString,
      ),
    } satisfies MultipleChoiceQuestion,
  };
}

function validateSingleChoiceAnswer(
  input: Record<string, unknown>,
  path: string,
  validOptionIds: Set<string>,
  issues: ValidationIssue[],
): void {
  const correctAnswerPath = `${path}.correctAnswer`;

  if (!isNonEmptyString(input.correctAnswer)) {
    issues.push(
      issue(
        correctAnswerPath,
        "required",
        "Single-choice questions require a non-empty correctAnswer.",
      ),
    );
    return;
  }

  if (validOptionIds.size > 0 && !validOptionIds.has(input.correctAnswer)) {
    issues.push(
      issue(
        correctAnswerPath,
        "invalid_reference",
        `correctAnswer "${input.correctAnswer}" does not match any option id.`,
      ),
    );
  }
}

function validateMultipleChoiceAnswers(
  input: Record<string, unknown>,
  path: string,
  validOptionIds: Set<string>,
  issues: ValidationIssue[],
): void {
  const correctAnswersPath = `${path}.correctAnswers`;

  if (!Array.isArray(input.correctAnswers)) {
    issues.push(
      issue(
        correctAnswersPath,
        "invalid_type",
        "Multiple-choice questions require a correctAnswers array.",
      ),
    );
    return;
  }

  if (input.correctAnswers.length < 1) {
    issues.push(
      issue(
        correctAnswersPath,
        "too_few_items",
        "Multiple-choice questions require at least one correct answer.",
      ),
    );
  }

  const answerIds: string[] = [];

  for (let index = 0; index < input.correctAnswers.length; index += 1) {
    const answerId = input.correctAnswers[index];
    const answerPath = `${correctAnswersPath}[${index}]`;

    if (!isNonEmptyString(answerId)) {
      issues.push(
        issue(
          answerPath,
          "required",
          "Each correct answer must be a non-empty string.",
        ),
      );
      continue;
    }

    answerIds.push(answerId);

    if (validOptionIds.size > 0 && !validOptionIds.has(answerId)) {
      issues.push(
        issue(
          answerPath,
          "invalid_reference",
          `correctAnswers entry "${answerId}" does not match any option id.`,
        ),
      );
    }
  }

  for (const duplicateId of collectDuplicateIds(answerIds)) {
    issues.push(
      issue(
        correctAnswersPath,
        "duplicate_id",
        `Duplicate correct answer id "${duplicateId}".`,
      ),
    );
  }
}
