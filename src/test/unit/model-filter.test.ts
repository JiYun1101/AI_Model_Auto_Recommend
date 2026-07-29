import { describe, it, expect } from "vitest";
import { filterModels } from "@/src/features/model-recommendation/application/model-filter";
import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";
import type { PromptAnalysis } from "@/src/shared/validation/prompt-analysis.schema";

function makeModel(overrides: Partial<ModelProfile> = {}): ModelProfile {
  return {
    id: "test/model",
    provider: "Test",
    displayName: "Test Model",
    family: "Test",
    accessType: ["api"],
    isOpenWeight: false,
    isFreeExecutable: false,
    inputModalities: ["text"],
    outputModalities: ["text"],
    contextWindow: 128000,
    supportsReasoning: false,
    supportsToolCalling: false,
    supportsStructuredOutput: false,
    supportsWebSearch: false,
    taskScores: {
      general: 75,
      coding: 75,
      reasoning: 75,
      writing: 75,
      translation: 75,
      summarization: 75,
      longContext: 75,
    },
    qualityTier: 3,
    speedTier: 3,
    costTier: 3,
    stabilityTier: 3,
    strengths: [],
    limitations: [],
    status: "active",
    lastVerifiedAt: "2025-07-01T00:00:00Z",
    ...overrides,
  };
}

function makeAnalysis(overrides: Partial<PromptAnalysis> = {}): PromptAnalysis {
  return {
    taskType: "general",
    complexity: "standard",
    inputLanguage: "ko",
    estimatedInputTokens: 100,
    estimatedOutputLength: "medium",
    requiredCapabilities: [],
    priorities: { quality: 0.5, cost: 0.3, speed: 0.2 },
    confidence: 0.8,
    reasons: [],
    ...overrides,
  };
}

describe("filterModels", () => {
  it("활성 모델은 eligible에 포함된다", () => {
    const model = makeModel({ status: "active" });
    const result = filterModels([model], makeAnalysis());
    expect(result.eligible).toHaveLength(1);
    expect(result.excluded).toHaveLength(0);
  });

  it("deprecated 모델은 제외된다", () => {
    const model = makeModel({ status: "deprecated" });
    const result = filterModels([model], makeAnalysis());
    expect(result.eligible).toHaveLength(0);
    expect(result.excluded).toHaveLength(1);
    expect(result.excluded[0]?.reasons).toContain(
      "모델 상태가 deprecated입니다."
    );
  });

  it("unavailable 모델은 제외된다", () => {
    const model = makeModel({ status: "unavailable" });
    const result = filterModels([model], makeAnalysis());
    expect(result.eligible).toHaveLength(0);
  });

  it("컨텍스트 한도 초과 모델은 제외된다", () => {
    const model = makeModel({ contextWindow: 1000 });
    const analysis = makeAnalysis({ estimatedInputTokens: 5000 });
    const result = filterModels([model], analysis);
    expect(result.eligible).toHaveLength(0);
    expect(result.excluded[0]?.reasons[0]).toContain("컨텍스트 한도");
  });

  it("vision 미지원 모델은 vision 요청에서 제외된다", () => {
    const model = makeModel({ inputModalities: ["text"] });
    const analysis = makeAnalysis({ requiredCapabilities: ["vision"] });
    const result = filterModels([model], analysis);
    expect(result.eligible).toHaveLength(0);
  });

  it("vision 지원 모델은 vision 요청에서 포함된다", () => {
    const model = makeModel({ inputModalities: ["text", "image"] });
    const analysis = makeAnalysis({ requiredCapabilities: ["vision"] });
    const result = filterModels([model], analysis);
    expect(result.eligible).toHaveLength(1);
  });

  it("구조화 출력 미지원 모델은 structured_output 요청에서 제외된다", () => {
    const model = makeModel({ supportsStructuredOutput: false });
    const analysis = makeAnalysis({
      requiredCapabilities: ["structured_output"],
    });
    const result = filterModels([model], analysis);
    expect(result.eligible).toHaveLength(0);
  });

  it("코딩 점수가 최소 기준 미만인 모델은 코딩 작업에서 제외된다", () => {
    const model = makeModel({
      taskScores: {
        general: 75,
        coding: 30,
        reasoning: 75,
        writing: 75,
        translation: 75,
        summarization: 75,
        longContext: 75,
      },
    });
    const analysis = makeAnalysis({ taskType: "coding" });
    const result = filterModels([model], analysis);
    expect(result.eligible).toHaveLength(0);
  });

  it("무료 전용 모드에서 유료 모델은 제외된다", () => {
    const model = makeModel({ isFreeExecutable: false });
    const result = filterModels([model], makeAnalysis(), { freeOnly: true });
    expect(result.eligible).toHaveLength(0);
  });

  it("무료 전용 모드에서 무료 모델은 포함된다", () => {
    const model = makeModel({ isFreeExecutable: true });
    const result = filterModels([model], makeAnalysis(), { freeOnly: true });
    expect(result.eligible).toHaveLength(1);
  });
});
