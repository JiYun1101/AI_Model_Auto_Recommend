import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/src/shared/lib/api-response";
import { AppError } from "@/src/shared/errors/app-error";
import { FeedbackRequestSchema } from "@/src/shared/validation/api.schema";
import { getFeedbackRepository } from "@/src/features/feedback/infrastructure/feedback-repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("VALIDATION_ERROR", "요청 본문이 올바르지 않습니다.");
    }

    const parsed = FeedbackRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "입력값이 유효하지 않습니다.");
    }

    const repo = getFeedbackRepository();
    const id = await repo.save(parsed.data);

    return apiSuccess({ id, saved: true }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
