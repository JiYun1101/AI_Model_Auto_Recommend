import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/src/shared/lib/api-response";
import { AppError } from "@/src/shared/errors/app-error";
import { AnalyzeRequestSchema } from "@/src/shared/validation/api.schema";
import { preprocessInput } from "@/src/features/prompt-analysis/application/input-preprocessor";
import { createPromptAnalyzer } from "@/src/features/prompt-analysis/application/analyzer-factory";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("VALIDATION_ERROR", "요청 본문이 올바르지 않습니다.");
    }

    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "입력값이 유효하지 않습니다.");
    }

    const processedPrompt = preprocessInput(parsed.data.prompt);
    const analyzer = createPromptAnalyzer();
    const analysis = await analyzer.analyze({ prompt: processedPrompt });

    return apiSuccess({ analysis });
  } catch (err) {
    return handleApiError(err);
  }
}
