import type { PromptAnalyzer } from "../domain/analyzer";
import { RuleBasedPromptAnalyzer } from "./rule-based-analyzer";
import { LlmPromptAnalyzer } from "./llm-analyzer";

export function createPromptAnalyzer(): PromptAnalyzer {
  const mode = process.env.PROMPT_ANALYZER_MODE ?? "rule-based";
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  if (mode === "llm" && (geminiKey || openrouterKey)) {
    return new LlmPromptAnalyzer(geminiKey ?? openrouterKey ?? "");
  }

  return new RuleBasedPromptAnalyzer();
}
