export type ValidationIssueCode =
  | "required"
  | "invalid_type"
  | "too_few_items"
  | "duplicate_id"
  | "invalid_reference"
  | "invalid_enum"
  | "invalid_value";

export interface ValidationIssue {
  path: string;
  code: ValidationIssueCode;
  message: string;
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; issues: ValidationIssue[] };

export class QuizValidationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    super(`Quiz validation failed with ${issues.length} issue(s).`);
    this.name = "QuizValidationError";
    this.issues = issues;
  }
}
