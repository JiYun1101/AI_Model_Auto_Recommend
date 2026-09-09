import { describe, expect, it } from "vitest";
import { getModelWebUrl } from "@/src/features/model-recommendation/ui/lib/model-handoff";

describe("getModelWebUrl", () => {
  it.each([
    ["openai/gpt-4o", "https://chatgpt.com/"],
    ["anthropic/claude-sonnet-4-5", "https://claude.ai/new"],
    ["google/gemini-2.5-pro", "https://gemini.google.com/app"],
    ["deepseek/deepseek-r1", "https://chat.deepseek.com/"],
    ["mistral/mistral-small-3.1", "https://chat.mistral.ai/chat"],
  ])("maps %s to its web app", (modelId, expectedUrl) => {
    expect(getModelWebUrl(modelId)).toBe(expectedUrl);
  });

  it.each([
    "google/gemma-3-27b",
    "meta/llama-3.3-70b",
    "qwen/qwen2.5-coder-32b",
  ])("returns null when there is no canonical web chat target for %s", (modelId) => {
    expect(getModelWebUrl(modelId)).toBeNull();
  });
});
