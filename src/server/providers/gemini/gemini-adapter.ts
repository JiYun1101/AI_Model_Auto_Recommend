import type {
  ModelProviderAdapter,
  ModelProviderInput,
  ModelProviderOutput,
} from "../provider-adapter";
import { AppError } from "@/src/shared/errors/app-error";

/** Phase 2 구현 예정. API 키가 없으면 호출 불가. */
export class GeminiAdapter implements ModelProviderAdapter {
  readonly provider = "google";

  constructor(private readonly apiKey: string) {}

  supports(modelId: string): boolean {
    return modelId.startsWith("google/gemini");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateText(_input: ModelProviderInput): Promise<ModelProviderOutput> {
    throw new AppError(
      "PROVIDER_UNAVAILABLE",
      "Gemini 어댑터는 Phase 2에서 구현됩니다."
    );
  }
}
