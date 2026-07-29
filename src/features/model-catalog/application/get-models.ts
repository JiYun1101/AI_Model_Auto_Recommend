import type { ModelCatalogRepository } from "../domain/repository";
import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";
import type { ModelsQuery } from "@/src/shared/validation/api.schema";

export async function getModels(
  repo: ModelCatalogRepository,
  query: ModelsQuery
): Promise<ModelProfile[]> {
  return repo.findByFilter({
    provider: query.provider,
    status: query.status,
    isFreeExecutable: query.free,
    isOpenWeight: query.openWeight,
  });
}
