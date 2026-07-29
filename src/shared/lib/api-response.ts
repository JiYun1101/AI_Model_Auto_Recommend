import { NextResponse } from "next/server";
import { AppError } from "../errors/app-error";
import type { AppErrorCode } from "../errors/app-error";

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function apiError(
  code: AppErrorCode,
  message: string,
  status = 400,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status }
  );
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof AppError) {
    const statusMap: Partial<Record<AppErrorCode, number>> = {
      VALIDATION_ERROR: 400,
      PROMPT_ANALYSIS_FAILED: 500,
      MODEL_CATALOG_UNAVAILABLE: 503,
      NO_ELIGIBLE_MODEL: 422,
      RECOMMENDATION_FAILED: 500,
      RATE_LIMITED: 429,
      PROVIDER_UNAVAILABLE: 503,
      INTERNAL_ERROR: 500,
    };
    const status = statusMap[err.code] ?? 500;
    return apiError(err.code, err.message, status, err.details);
  }

  // 내부 오류 정보를 클라이언트에 노출하지 않음
  return apiError("INTERNAL_ERROR", "서버 오류가 발생했습니다.", 500);
}
