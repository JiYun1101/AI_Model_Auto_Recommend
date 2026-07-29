import type { PromptAnalysis } from "@/src/shared/validation/prompt-analysis.schema";

export interface PromptAnalyzerInput {
  prompt: string;
  conversationContext?: string;
}

export interface PromptAnalyzer {
  analyze(input: PromptAnalyzerInput): Promise<PromptAnalysis>;
}
