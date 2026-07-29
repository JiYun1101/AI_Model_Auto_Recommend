import type {
  ModelProviderAdapter,
  ModelProviderInput,
  ModelProviderOutput,
} from "../provider-adapter";
import { AppError } from "@/src/shared/errors/app-error";

/** Phase 2 구현 예정. API 키가 없으면 호출 불가. */
export class OpenRouterAdapter implements ModelProviderAdapter {
  readonly provider = "openrouter";

  constructor(private readonly apiKey: string) {}

  supports(_modelId: string): boolean {
    return true; // OpenRouter는 다수 모델 지원
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateText(_input: ModelProviderInput): Promise<ModelProviderOutput> {
    throw new AppError(
      "PROVIDER_UNAVAILABLE",
      "OpenRouter 어댑터는 Phase 2에서 구현됩니다."
    );
  }
}
