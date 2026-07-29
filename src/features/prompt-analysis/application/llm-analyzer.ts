import type { PromptAnalyzer, PromptAnalyzerInput } from "../domain/analyzer";
import type { PromptAnalysis } from "@/src/shared/validation/prompt-analysis.schema";
import { AppError } from "@/src/shared/errors/app-error";

/**
 * LlmPromptAnalyzer: Phase 2에서 실제 LLM API를 호출하는 분석기 골격.
 * GEMINI_API_KEY 또는 OPENROUTER_API_KEY가 없으면 호출되지 않음.
 */
export class LlmPromptAnalyzer implements PromptAnalyzer {
  constructor(private readonly apiKey: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async analyze(_input: PromptAnalyzerInput): Promise<PromptAnalysis> {
    throw new AppError(
      "PROMPT_ANALYSIS_FAILED",
      "LLM 분석기는 Phase 2에서 구현됩니다."
    );
  }
}
