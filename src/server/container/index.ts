import { SeedModelCatalogRepository } from "@/src/features/model-catalog/infrastructure/seed-catalog.repository";
import type { ModelCatalogRepository } from "@/src/features/model-catalog/domain/repository";

// Phase 1: 메모리 시드 구현체 사용
// Phase 2: Supabase/Postgres 구현체로 교체
let modelCatalogRepo: ModelCatalogRepository | null = null;

export function getModelCatalogRepository(): ModelCatalogRepository {
  if (!modelCatalogRepo) {
    modelCatalogRepo = new SeedModelCatalogRepository();
  }
  return modelCatalogRepo;
}
