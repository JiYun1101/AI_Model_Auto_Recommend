import { describe, it, expect } from "vitest";
import {
  scoreModel,
  rankModels,
} from "@/src/features/model-recommendation/application/model-scorer";
import { buildRecommendations } from "@/src/features/model-recommendation/application/recommendation-builder";
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

describe("scoreModel", () => {
  it("코딩 요청에서 코딩 점수가 높은 모델이 높은 점수를 받는다", () => {
    const highCoder = makeModel({
      id: "test/high-coder",
      taskScores: {
        general: 70,
        coding: 95,
        reasoning: 70,
        writing: 70,
        translation: 70,
        summarization: 70,
        longContext: 70,
      },
    });
    const lowCoder = makeModel({
      id: "test/low-coder",
      taskScores: {
        general: 70,
        coding: 55,
        reasoning: 70,
        writing: 70,
        translation: 70,
        summarization: 70,
        longContext: 70,
      },
    });
    const analysis = makeAnalysis({ taskType: "coding" });
    const high = scoreModel(highCoder, analysis);
    const low = scoreModel(lowCoder, analysis);
    expect(high.totalScore).toBeGreaterThan(low.totalScore);
  });

  it("번역 요청에서 번역 점수가 높은 모델이 높은 점수를 받는다", () => {
    const translator = makeModel({
      id: "test/translator",
      taskScores: {
        general: 70,
        coding: 70,
        reasoning: 70,
        writing: 70,
        translation: 95,
        summarization: 70,
        longContext: 70,
      },
    });
    const generic = makeModel({
      id: "test/generic",
      taskScores: {
        general: 70,
        coding: 70,
        reasoning: 70,
        writing: 70,
        translation: 60,
        summarization: 70,
        longContext: 70,
      },
    });
    const analysis = makeAnalysis({ taskType: "translation" });
    const tScore = scoreModel(translator, analysis);
    const gScore = scoreModel(generic, analysis);
    expect(tScore.totalScore).toBeGreaterThan(gScore.totalScore);
  });

  it("비용 우선순위가 높으면 저렴한 모델 점수가 상승한다", () => {
    const cheap = makeModel({
      id: "test/cheap",
      costTier: 0,
      taskScores: {
        general: 70,
        coding: 70,
        reasoning: 70,
        writing: 70,
        translation: 70,
        summarization: 70,
        longContext: 70,
      },
    });
    const expensive = makeModel({
      id: "test/expensive",
      costTier: 5,
      taskScores: {
        general: 70,
        coding: 70,
        reasoning: 70,
        writing: 70,
        translation: 70,
        summarization: 70,
        longContext: 70,
      },
    });
    const analysis = makeAnalysis({
      priorities: { quality: 0.1, cost: 0.8, speed: 0.1 },
    });
    const cheapScore = scoreModel(cheap, analysis);
    const expensiveScore = scoreModel(expensive, analysis);
    expect(cheapScore.totalScore).toBeGreaterThan(expensiveScore.totalScore);
  });

  it("속도 우선순위가 높으면 빠른 모델 점수가 상승한다", () => {
    const fast = makeModel({
      id: "test/fast",
      speedTier: 5,
      taskScores: {
        general: 70,
        coding: 70,
        reasoning: 70,
        writing: 70,
        translation: 70,
        summarization: 70,
        longContext: 70,
      },
    });
    const slow = makeModel({
      id: "test/slow",
      speedTier: 1,
      taskScores: {
        general: 70,
        coding: 70,
        reasoning: 70,
        writing: 70,
        translation: 70,
        summarization: 70,
        longContext: 70,
      },
    });
    const analysis = makeAnalysis({
      priorities: { quality: 0.1, cost: 0.1, speed: 0.8 },
    });
    expect(scoreModel(fast, analysis).totalScore).toBeGreaterThan(
      scoreModel(slow, analysis).totalScore
    );
  });
});

describe("rankModels + 동점 처리", () => {
  it("동일한 입력에 대해 항상 동일한 순서를 반환한다", () => {
    const models = [
      makeModel({ id: "test/b", stabilityTier: 3 }),
      makeModel({ id: "test/a", stabilityTier: 3 }),
      makeModel({ id: "test/c", stabilityTier: 3 }),
    ];
    const analysis = makeAnalysis();
    const scored = models.map((m) => scoreModel(m, analysis));

    const run1 = rankModels(scored).map((s) => s.model.id);
    const run2 = rankModels(scored).map((s) => s.model.id);
    expect(run1).toEqual(run2);
  });
});

describe("buildRecommendations", () => {
  it("추천 결과에 동일 모델이 중복되지 않는다", () => {
    const freeModel = makeModel({
      id: "test/free",
      isFreeExecutable: true,
      costTier: 0,
      speedTier: 5,
    });
    const paidModel = makeModel({
      id: "test/paid",
      isFreeExecutable: false,
      qualityTier: 5,
    });
    const analysis = makeAnalysis();
    const scored = [freeModel, paidModel].map((m) => ({
      model: m,
      totalScore: scoreModel(m, analysis).totalScore,
      breakdown: scoreModel(m, analysis).breakdown,
    }));

    const recommendations = buildRecommendations(ranked(scored), analysis);
    const ids = recommendations.map((r) => r.modelId);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });

  it("추천 순위가 1부터 순차적으로 부여된다", () => {
    const models = [
      makeModel({
        id: "test/a",
        isFreeExecutable: true,
        qualityTier: 4,
        costTier: 0,
        speedTier: 5,
      }),
      makeModel({ id: "test/b", qualityTier: 5 }),
      makeModel({ id: "test/c", speedTier: 5, costTier: 1 }),
    ];
    const analysis = makeAnalysis();
    const scored = models.map((m) => ({
      model: m,
      ...scoreModel(m, analysis),
    }));

    const recommendations = buildRecommendations(ranked(scored), analysis);
    const ranks = recommendations.map((r) => r.rank);
    expect(ranks).toEqual(ranks.sort((a, b) => a - b));
  });
});

function ranked(scored: ReturnType<typeof scoreModel>[]) {
  return [...scored].sort((a, b) => b.totalScore - a.totalScore);
}
