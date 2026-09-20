import type { PromptAnalyzer } from "../domain/analyzer";
import { RuleBasedPromptAnalyzer } from "./rule-based-analyzer";
import { LlmPromptAnalyzer } from "./llm-analyzer";

export function createPromptAnalyzer(): PromptAnalyzer {
  const mode = process.env.PROMPT_ANALYZER_MODE ?? "auto";
  const fallback = new RuleBasedPromptAnalyzer();

  if (mode === "rule-based") {
    return fallback;
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  const primary = geminiKey
    ? new LlmPromptAnalyzer({
        provider: "gemini",
        apiKey: geminiKey,
        model: process.env.GEMINI_ANALYZER_MODEL ?? "gemini-3.8-flash",
      })
    : openrouterKey
      ? new LlmPromptAnalyzer({
          provider: "openrouter",
          apiKey: openrouterKey,
          model:
            process.env.OPENROUTER_ANALYZER_MODEL ??
            "google/gemini-3.8-flash",
        })
      : null;

  if (!primary) {
    return fallback;
  }

  return {
    async analyze(input) {
      try {
        return await primary.analyze(input);
      } catch (error) {
        console.warn(
          "[ModelFit] LLM analyzer failed; falling back to deterministic analysis.",
          error
        );
        return fallback.analyze(input);
      }
    },
  };
}
