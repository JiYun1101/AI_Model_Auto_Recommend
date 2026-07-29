export interface ModelProviderMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ModelProviderInput {
  modelId: string;
  messages: ModelProviderMessage[];
  maxOutputTokens?: number;
  signal?: AbortSignal;
}

export interface ModelProviderOutput {
  content: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
}

/** Phase 2에서 실제 구현. Phase 1에서는 인터페이스만 정의. */
export interface ModelProviderAdapter {
  provider: string;
  supports(modelId: string): boolean;
  generateText(input: ModelProviderInput): Promise<ModelProviderOutput>;
}
