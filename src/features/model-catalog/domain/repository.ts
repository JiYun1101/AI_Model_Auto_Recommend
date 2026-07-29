import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";

export interface ModelCatalogRepository {
  findAll(): Promise<ModelProfile[]>;
  findById(id: string): Promise<ModelProfile | null>;
  findActive(): Promise<ModelProfile[]>;
  findByFilter(filter: {
    provider?: string;
    status?: ModelProfile["status"];
    isFreeExecutable?: boolean;
    isOpenWeight?: boolean;
  }): Promise<ModelProfile[]>;
}
