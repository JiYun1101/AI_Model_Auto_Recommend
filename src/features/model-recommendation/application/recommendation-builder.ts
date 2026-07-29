import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";
import type { PromptAnalysis } from "@/src/shared/validation/prompt-analysis.schema";
import type {
  ModelRecommendation,
  RecommendationType,
} from "@/src/shared/validation/recommendation.schema";
import type { ModelScore } from "./model-scorer";

// ── 접근 정보 구성 ───────────────────────────────────────────

function buildAccess(model: ModelProfile): ModelRecommendation["access"] {
  return {
    webAvailable: model.accessType.includes("web"),
    apiAvailable: model.accessType.includes("api"),
    localAvailable:
      model.accessType.includes("local") ||
      model.accessType.includes("open-weight"),
    freeAvailable: model.isFreeExecutable,
  };
}

// ── 추천 이유 생성 ───────────────────────────────────────────

function buildReasons(
  model: ModelProfile,
  analysis: PromptAnalysis,
  type: RecommendationType,
  breakdown: ModelScore["breakdown"]
): string[] {
  const reasons: string[] = [];

  // 작업 적합성
  if (breakdown.taskFit >= 80) {
    reasons.push(
      `${getTaskLabel(analysis.taskType)} 작업에서 높은 적합성을 보입니다.`
    );
  } else if (breakdown.taskFit >= 65) {
    reasons.push(`${getTaskLabel(analysis.taskType)} 작업을 처리하기에 적합합니다.`);
  }

  // 컨텍스트
  if (
    analysis.requiredCapabilities.includes("long_context") &&
    (model.contextWindow ?? 0) >= 100000
  ) {
    reasons.push(
      `${(model.contextWindow! / 1000).toFixed(0)}K 컨텍스트로 긴 입력을 처리할 수 있습니다.`
    );
  }

  // 추론 특화
  if (model.supportsReasoning && analysis.requiredCapabilities.includes("reasoning")) {
    reasons.push("복잡한 추론 작업에 최적화된 모델입니다.");
  }

  // 무료 대안
  if (type === "free_alternative") {
    if (model.isFreeExecutable && model.freeExecutionProvider) {
      reasons.push(`${model.freeExecutionProvider}을(를) 통해 무료로 실행 가능합니다.`);
    }
    if (model.isOpenWeight) {
      reasons.push("오픈 가중치 모델로 자유로운 활용이 가능합니다.");
    }
    if (model.accessType.includes("local")) {
      reasons.push("로컬 환경에서 실행할 수 있습니다.");
    }
  }

  // 빠른 경제형
  if (type === "fast_economy") {
    if (model.speedTier >= 4) reasons.push("빠른 응답 속도를 제공합니다.");
    if (model.costTier <= 1) reasons.push("비용 효율이 높습니다.");
  }

  // 품질 우선
  if (type === "best" && model.qualityTier >= 4) {
    reasons.push("전반적인 품질과 안정성이 우수합니다.");
  }

  return reasons.length > 0 ? reasons : ["요청 조건에 전반적으로 적합합니다."];
}

// ── 한계 생성 ─────────────────────────────────────────────

function buildLimitations(
  model: ModelProfile,
  type: RecommendationType
): string[] {
  const limitations: string[] = [...model.limitations];

  if (type === "free_alternative" && model.isFreeExecutable) {
    limitations.push("무료 API의 호출 한도가 변동될 수 있습니다.");
  }

  return limitations;
}

// ── 작업 유형 레이블 ─────────────────────────────────────────

function getTaskLabel(taskType: PromptAnalysis["taskType"]): string {
  const labels: Record<string, string> = {
    general: "일반",
    coding: "코딩",
    debugging: "디버깅",
    reasoning: "추론",
    writing: "글쓰기",
    translation: "번역",
    summarization: "요약",
    research: "조사",
    data_extraction: "데이터 추출",
    planning: "계획",
  };
  return labels[taskType] ?? taskType;
}

// ── 무료/오픈 가중치 여부 판단 ──────────────────────────────

function isFreeOrOpen(model: ModelProfile): boolean {
  return (
    model.isFreeExecutable ||
    model.isOpenWeight ||
    model.accessType.includes("local") ||
    model.accessType.includes("open-weight")
  );
}

// ── 추천 결과 구성 ───────────────────────────────────────────

const MAX_RECOMMENDATIONS = 3;

export function buildRecommendations(
  ranked: ModelScore[],
  analysis: PromptAnalysis
): ModelRecommendation[] {
  const results: ModelRecommendation[] = [];
  const usedIds = new Set<string>();

  // 1. best: 상위 점수 모델
  const best = ranked[0];
  if (best) {
    usedIds.add(best.model.id);
    results.push({
      modelId: best.model.id,
      rank: 1,
      recommendationType: "best",
      score: Math.round(best.totalScore),
      confidence: analysis.confidence,
      reasons: buildReasons(best.model, analysis, "best", best.breakdown),
      limitations: buildLimitations(best.model, "best"),
      access: buildAccess(best.model),
    });
  }

  // 2. free_alternative: 무료/오픈 모델 중 상위 (이미 추천된 모델 제외)
  const freeCandidate = ranked.find(
    (s) => !usedIds.has(s.model.id) && isFreeOrOpen(s.model)
  );
  if (freeCandidate && results.length < MAX_RECOMMENDATIONS) {
    usedIds.add(freeCandidate.model.id);
    results.push({
      modelId: freeCandidate.model.id,
      rank: 2,
      recommendationType: "free_alternative",
      score: Math.round(freeCandidate.totalScore),
      confidence: analysis.confidence * 0.9,
      reasons: buildReasons(
        freeCandidate.model,
        analysis,
        "free_alternative",
        freeCandidate.breakdown
      ),
      limitations: buildLimitations(freeCandidate.model, "free_alternative"),
      access: buildAccess(freeCandidate.model),
    });
  }

  // 3. fast_economy: 속도+비용 우선 (이미 추천된 모델 제외)
  const economyCandidate = ranked.find(
    (s) =>
      !usedIds.has(s.model.id) &&
      s.model.speedTier >= 3 &&
      s.model.costTier <= 2
  );
  if (economyCandidate && results.length < MAX_RECOMMENDATIONS) {
    usedIds.add(economyCandidate.model.id);
    results.push({
      modelId: economyCandidate.model.id,
      rank: 3,
      recommendationType: "fast_economy",
      score: Math.round(economyCandidate.totalScore),
      confidence: analysis.confidence * 0.85,
      reasons: buildReasons(
        economyCandidate.model,
        analysis,
        "fast_economy",
        economyCandidate.breakdown
      ),
      limitations: buildLimitations(economyCandidate.model, "fast_economy"),
      access: buildAccess(economyCandidate.model),
    });
  }

  return results;
}
