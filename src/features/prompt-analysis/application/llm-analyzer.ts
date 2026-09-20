import type { PromptAnalyzer, PromptAnalyzerInput } from "../domain/analyzer";
import {
  PromptAnalysisSchema,
  type PromptAnalysis,
} from "@/src/shared/validation/prompt-analysis.schema";
import { AppError } from "@/src/shared/errors/app-error";

type AnalyzerProvider = "gemini" | "openrouter";

interface LlmPromptAnalyzerOptions {
  provider: AnalyzerProvider;
  apiKey: string;
  model: string;
}

const SYSTEM_PROMPT = `
You classify a user's prompt for an AI model recommendation service.
Return JSON only. Do not include markdown fences or extra prose.

Required JSON shape:
{
  "taskType": "general" | "coding" | "debugging" | "reasoning" | "writing" | "translation" | "summarization" | "research" | "data_extraction" | "planning",
  "complexity": "simple" | "standard" | "complex",
  "inputLanguage": string,
  "estimatedInputTokens": number,
  "estimatedOutputLength": "short" | "medium" | "long",
  "requiredCapabilities": Array<"long_context" | "vision" | "tool_calling" | "structured_output" | "reasoning" | "coding" | "multilingual">,
  "priorities": {
    "quality": number,
    "cost": number,
    "speed": number
  },
  "confidence": number,
  "reasons": string[]
}

Rules:
- quality/cost/speed must each be between 0 and 1.
- Use priorities { "quality": 0.5, "cost": 0.3, "speed": 0.2 } unless the prompt itself explicitly asks for cheap/free, speed, or maximum quality.
- reasons should contain 1 to 3 short Korean sentences that explain the classification.
- confidence must be between 0 and 1.
- Do not infer a need for vision unless the user refers to an image, screenshot, PDF, attachment, visual, or file.
- Do not infer tool_calling unless the requested task clearly needs external actions or tools.
`.trim();

export class LlmPromptAnalyzer implements PromptAnalyzer {
  constructor(private readonly options: LlmPromptAnalyzerOptions) {}

  async analyze(input: PromptAnalyzerInput): Promise<PromptAnalysis> {
    try {
      const raw =
        this.options.provider === "gemini"
          ? await this.analyzeWithGemini(input.prompt)
          : await this.analyzeWithOpenRouter(input.prompt);

      return PromptAnalysisSchema.parse(parseJson(raw));
    } catch (error) {
      throw new AppError(
        "PROMPT_ANALYSIS_FAILED",
        "LLM 프롬프트 분석에 실패했습니다.",
        {
          provider: this.options.provider,
          cause: error instanceof Error ? error.message : "unknown",
        }
      );
    }
  }

  private async analyzeWithGemini(prompt: string): Promise<string> {
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        this.options.model
      )}:generateContent?key=${encodeURIComponent(this.options.apiKey)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0,
        },
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw new Error("Gemini API returned an empty analysis.");
    }

    return text;
  }

  private async analyzeWithOpenRouter(prompt: string): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://modelfit.app",
        "X-Title": "ModelFit",
      },
      body: JSON.stringify({
        model: this.options.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API returned ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("OpenRouter returned an empty analysis.");
    }

    return text;
  }
}

function parseJson(raw: string): unknown {
  const trimmed = raw.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return JSON.parse(trimmed);
  }

  const fenced = trimmed.match(/\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`/i);
  if (fenced?.[1]) {
    return JSON.parse(fenced[1]);
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }

  throw new Error("LLM response did not contain JSON.");
}
