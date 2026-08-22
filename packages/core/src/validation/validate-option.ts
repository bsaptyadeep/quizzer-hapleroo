import type { QuizOption } from "../types/quiz-definition";
import type { ValidationIssue } from "./errors";
import {
  collectDuplicateIds,
  isNonEmptyString,
  isRecord,
  issue,
} from "./helpers";

export interface ValidateOptionsResult {
  issues: ValidationIssue[];
  options: QuizOption[];
}

export function validateOptions(
  input: unknown,
  path: string,
): ValidateOptionsResult {
  const issues: ValidationIssue[] = [];
  const options: QuizOption[] = [];

  if (!Array.isArray(input)) {
    issues.push(
      issue(path, "invalid_type", "Options must be an array."),
    );
    return { issues, options };
  }

  if (input.length < 2) {
    issues.push(
      issue(path, "too_few_items", "At least 2 options are required."),
    );
  }

  const optionIds: string[] = [];

  for (let index = 0; index < input.length; index += 1) {
    const optionInput = input[index];
    const optionPath = `${path}[${index}]`;

    if (!isRecord(optionInput)) {
      issues.push(
        issue(optionPath, "invalid_type", "Option must be an object."),
      );
      continue;
    }

    const idPath = `${optionPath}.id`;
    const labelPath = `${optionPath}.label`;

    if (!isNonEmptyString(optionInput.id)) {
      issues.push(
        issue(idPath, "required", "Option id must be a non-empty string."),
      );
    } else {
      optionIds.push(optionInput.id);
    }

    if (!isNonEmptyString(optionInput.label)) {
      issues.push(
        issue(labelPath, "required", "Option label must be a non-empty string."),
      );
    }

    if (
      isNonEmptyString(optionInput.id) &&
      isNonEmptyString(optionInput.label)
    ) {
      options.push({
        id: optionInput.id,
        label: optionInput.label,
      });
    }
  }

  for (const duplicateId of collectDuplicateIds(optionIds)) {
    issues.push(
      issue(
        path,
        "duplicate_id",
        `Duplicate option id "${duplicateId}" within question.`,
      ),
    );
  }

  return { issues, options };
}
