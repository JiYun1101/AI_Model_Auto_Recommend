import type { ModelCatalogRepository } from "@/src/features/model-catalog/domain/repository";
import type { PromptAnalysis } from "@/src/shared/validation/prompt-analysis.schema";
import type {
  ModelRecommendation,
  RecommendationMetadata,
} from "@/src/shared/validation/recommendation.schema";
import { AppError } from "@/src/shared/errors/app-error";
import { filterModels } from "./model-filter";
import { scoreModel, rankModels } from "./model-scorer";
import { buildRecommendations } from "./recommendation-builder";

const CATALOG_VERSION = "2025-07-01";

export interface RecommendResult {
  recommendations: ModelRecommendation[];
  metadata: RecommendationMetadata;
}

export async function recommendModels(
  repo: ModelCatalogRepository,
  analysis: PromptAnalysis,
  options: { freeOnly?: boolean } = {}
): Promise<RecommendResult> {
  const activeModels = await repo.findActive();

  const { eligible, excluded } = filterModels(activeModels, analysis, options);

  const scored = eligible.map((m) => scoreModel(m, analysis));
  const ranked = rankModels(scored);
  const recommendations = buildRecommendations(ranked, analysis);

  if (recommendations.length === 0) {
    throw new AppError(
      "NO_ELIGIBLE_MODEL",
      "요청 조건을 충족하는 모델을 찾지 못했습니다.",
      { excludedCount: excluded.length }
    );
  }

  return {
    recommendations,
    metadata: {
      catalogVersion: CATALOG_VERSION,
      evaluatedModelCount: activeModels.length,
      eligibleModelCount: eligible.length,
    },
  };
}
