export const APP_ERROR_CODES = [
  "VALIDATION_ERROR",
  "PROMPT_ANALYSIS_FAILED",
  "MODEL_CATALOG_UNAVAILABLE",
  "NO_ELIGIBLE_MODEL",
  "RECOMMENDATION_FAILED",
  "RATE_LIMITED",
  "PROVIDER_UNAVAILABLE",
  "INTERNAL_ERROR",
] as const;

export type AppErrorCode = (typeof APP_ERROR_CODES)[number];

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
