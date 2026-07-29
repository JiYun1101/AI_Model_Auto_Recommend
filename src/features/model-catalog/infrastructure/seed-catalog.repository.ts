import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";
import type { ModelCatalogRepository } from "../domain/repository";
import { MODEL_CATALOG_SEED } from "./model-catalog.seed";

export class SeedModelCatalogRepository implements ModelCatalogRepository {
  private readonly models: ModelProfile[];

  constructor(seed: ModelProfile[] = MODEL_CATALOG_SEED) {
    this.models = seed;
  }

  async findAll(): Promise<ModelProfile[]> {
    return [...this.models];
  }

  async findById(id: string): Promise<ModelProfile | null> {
    return this.models.find((m) => m.id === id) ?? null;
  }

  async findActive(): Promise<ModelProfile[]> {
    return this.models.filter(
      (m) => m.status === "active" || m.status === "preview"
    );
  }

  async findByFilter(filter: {
    provider?: string;
    status?: ModelProfile["status"];
    isFreeExecutable?: boolean;
    isOpenWeight?: boolean;
  }): Promise<ModelProfile[]> {
    return this.models.filter((m) => {
      if (filter.provider && m.provider !== filter.provider) return false;
      if (filter.status && m.status !== filter.status) return false;
      if (
        filter.isFreeExecutable !== undefined &&
        m.isFreeExecutable !== filter.isFreeExecutable
      )
        return false;
      if (
        filter.isOpenWeight !== undefined &&
        m.isOpenWeight !== filter.isOpenWeight
      )
        return false;
      return true;
    });
  }
}
