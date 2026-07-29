import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/src/shared/lib/api-response";
import { AppError } from "@/src/shared/errors/app-error";
import { ModelsQuerySchema } from "@/src/shared/validation/api.schema";
import { getModelCatalogRepository } from "@/src/server/container";
import { getModels } from "@/src/features/model-catalog/application/get-models";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const parsed = ModelsQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      throw new AppError("VALIDATION_ERROR", "쿼리 파라미터가 유효하지 않습니다.");
    }

    const repo = getModelCatalogRepository();
    const models = await getModels(repo, parsed.data);

    return apiSuccess({ models, count: models.length });
  } catch (err) {
    return handleApiError(err);
  }
}
