import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";
import type { PromptAnalysis, TaskType } from "@/src/shared/validation/prompt-analysis.schema";

// ── 가중치 설정 ──────────────────────────────────────────────

export const DEFAULT_WEIGHTS: {
  taskFit: number;
  featureFit: number;
  quality: number;
  cost: number;
  speed: number;
} = {
  taskFit: 0.40,
  featureFit: 0.20,
  quality: 0.15,
  cost: 0.15,
  speed: 0.10,
};

// ── 작업 유형 → 모델 점수 매핑 ──────────────────────────────

type ScoreKey = keyof ModelProfile["taskScores"];

const TASK_SCORE_MAPPING: Record<TaskType, ScoreKey[]> = {
  general: ["general"],
  coding: ["coding"],
  debugging: ["coding", "reasoning"],
  reasoning: ["reasoning"],
  writing: ["writing"],
  translation: ["translation"],
  summarization: ["summarization"],
  research: ["reasoning", "longContext"],
  data_extraction: ["general"],
  planning: ["reasoning", "writing"],
};

// ── 작업 적합성 점수 ─────────────────────────────────────────

function calcTaskFitScore(model: ModelProfile, taskType: TaskType): number {
  const keys = TASK_SCORE_MAPPING[taskType];
  const sum = keys.reduce((acc, k) => acc + model.taskScores[k], 0);
  return sum / keys.length;
}

// ── 기능 적합성 점수 ─────────────────────────────────────────

function calcFeatureFitScore(
  model: ModelProfile,
  analysis: PromptAnalysis
): number {
  const caps = analysis.requiredCapabilities;
  if (caps.length === 0) return 100;

  let score = 100;
  const deductionPerMissing = 100 / caps.length;

  for (const cap of caps) {
    switch (cap) {
      case "vision":
        if (!model.inputModalities.includes("image")) score -= deductionPerMissing;
        break;
      case "tool_calling":
        if (!model.supportsToolCalling) score -= deductionPerMissing;
        break;
      case "structured_output":
        if (!model.supportsStructuredOutput) score -= deductionPerMissing;
        break;
      case "reasoning":
        // supportsReasoning은 보너스로 처리 (필터에서 제거하지 않으므로 감점 절반)
        if (!model.supportsReasoning) score -= deductionPerMissing * 0.5;
        break;
      case "coding":
        // taskScores.coding 기준으로 이미 작업 적합성에 반영됨 – 소규모 보너스만
        if (model.taskScores.coding < 70) score -= deductionPerMissing * 0.5;
        break;
      case "long_context":
        if ((model.contextWindow ?? 0) < 32000) score -= deductionPerMissing;
        else if ((model.contextWindow ?? 0) < 100000) score -= deductionPerMissing * 0.3;
        break;
      case "multilingual":
        if (model.taskScores.translation < 60) score -= deductionPerMissing * 0.5;
        break;
    }
  }

  return Math.max(0, score);
}

// ── 비용 효율 점수 ───────────────────────────────────────────
// costTier 0(무료)→100점, 5(최고가)→0점

function calcCostScore(model: ModelProfile): number {
  return ((5 - model.costTier) / 5) * 100;
}

// ── 속도 점수 ────────────────────────────────────────────────
// speedTier 5→100점, 1→20점

function calcSpeedScore(model: ModelProfile): number {
  return model.speedTier * 20;
}

// ── 품질 점수 ────────────────────────────────────────────────

function calcQualityScore(model: ModelProfile): number {
  return model.qualityTier * 20;
}

// ── 우선순위 반영 가중치 조정 ────────────────────────────────

function adjustWeights(
  base: typeof DEFAULT_WEIGHTS,
  priorities: PromptAnalysis["priorities"]
): { taskFit: number; featureFit: number; quality: number; cost: number; speed: number } {
  // 사용자 우선순위로 quality/cost/speed 비중을 제한적으로 조정 (±15%p 이내)
  const MAX_SHIFT = 0.15;
  const qualityShift = (priorities.quality - 0.5) * MAX_SHIFT * 2;
  const costShift = (priorities.cost - 0.5) * MAX_SHIFT * 2;
  const speedShift = (priorities.speed - 0.5) * MAX_SHIFT * 2;

  const adjusted = {
    taskFit: base.taskFit,
    featureFit: base.featureFit,
    quality: Math.max(0.05, base.quality + qualityShift),
    cost: Math.max(0.05, base.cost + costShift),
    speed: Math.max(0.05, base.speed + speedShift),
  };

  // 총합이 1이 되도록 정규화
  const total =
    adjusted.taskFit +
    adjusted.featureFit +
    adjusted.quality +
    adjusted.cost +
    adjusted.speed;

  return {
    taskFit: adjusted.taskFit / total,
    featureFit: adjusted.featureFit / total,
    quality: adjusted.quality / total,
    cost: adjusted.cost / total,
    speed: adjusted.speed / total,
  };
}

// ── 총점 계산 ────────────────────────────────────────────────

export interface ModelScore {
  model: ModelProfile;
  totalScore: number;
  breakdown: {
    taskFit: number;
    featureFit: number;
    quality: number;
    cost: number;
    speed: number;
  };
}

export function scoreModel(
  model: ModelProfile,
  analysis: PromptAnalysis
): ModelScore {
  const weights = adjustWeights(DEFAULT_WEIGHTS, analysis.priorities);

  const taskFit = calcTaskFitScore(model, analysis.taskType);
  const featureFit = calcFeatureFitScore(model, analysis);
  const quality = calcQualityScore(model);
  const cost = calcCostScore(model);
  const speed = calcSpeedScore(model);

  const totalScore =
    taskFit * weights.taskFit +
    featureFit * weights.featureFit +
    quality * weights.quality +
    cost * weights.cost +
    speed * weights.speed;

  return {
    model,
    totalScore,
    breakdown: { taskFit, featureFit, quality, cost, speed },
  };
}

// ── 동점 처리 ────────────────────────────────────────────────

const TIEBREAK_THRESHOLD = 5;

function tiebreakCompare(a: ModelScore, b: ModelScore): number {
  if (Math.abs(a.totalScore - b.totalScore) >= TIEBREAK_THRESHOLD) return 0;

  // 1. 안정성
  const stabilityDiff = b.model.stabilityTier - a.model.stabilityTier;
  if (stabilityDiff !== 0) return stabilityDiff;

  // 2. 속도
  const speedDiff = b.model.speedTier - a.model.speedTier;
  if (speedDiff !== 0) return speedDiff;

  // 3. 컨텍스트 여유
  const ctxA = a.model.contextWindow ?? 0;
  const ctxB = b.model.contextWindow ?? 0;
  if (ctxB !== ctxA) return ctxB - ctxA;

  // 4. 비용
  const costDiff = a.model.costTier - b.model.costTier;
  if (costDiff !== 0) return costDiff;

  // 5. 모델 ID 오름차순 (결정성 보장)
  return a.model.id.localeCompare(b.model.id);
}

export function rankModels(scores: ModelScore[]): ModelScore[] {
  return [...scores].sort((a, b) => {
    const scoreDiff = b.totalScore - a.totalScore;
    if (Math.abs(scoreDiff) >= TIEBREAK_THRESHOLD) return scoreDiff;
    return tiebreakCompare(a, b);
  });
}
