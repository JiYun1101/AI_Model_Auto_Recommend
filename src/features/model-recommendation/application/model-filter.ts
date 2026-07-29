import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";
import type { PromptAnalysis } from "@/src/shared/validation/prompt-analysis.schema";

export interface ModelFilterResult {
  eligible: ModelProfile[];
  excluded: Array<{
    model: ModelProfile;
    reasons: string[];
  }>;
}

const CODING_TASK_TYPES = new Set(["coding", "debugging"]);
const MINIMUM_CODING_SCORE = 50;

export function filterModels(
  models: ModelProfile[],
  analysis: PromptAnalysis,
  options: { freeOnly?: boolean } = {}
): ModelFilterResult {
  const eligible: ModelProfile[] = [];
  const excluded: ModelFilterResult["excluded"] = [];

  for (const model of models) {
    const reasons: string[] = [];

    // 비활성 상태
    if (model.status === "deprecated" || model.status === "unavailable") {
      reasons.push(`모델 상태가 ${model.status}입니다.`);
    }

    // 필요한 입력 모달리티 미지원
    if (analysis.requiredCapabilities.includes("vision")) {
      if (!model.inputModalities.includes("image")) {
        reasons.push("이미지 입력을 지원하지 않습니다.");
      }
    }

    // 컨텍스트 초과
    if (
      model.contextWindow !== undefined &&
      analysis.estimatedInputTokens > model.contextWindow
    ) {
      reasons.push(
        `예상 입력 토큰(${analysis.estimatedInputTokens})이 컨텍스트 한도(${model.contextWindow})를 초과합니다.`
      );
    }

    // 구조화 출력 미지원
    if (
      analysis.requiredCapabilities.includes("structured_output") &&
      !model.supportsStructuredOutput
    ) {
      reasons.push("구조화 출력을 지원하지 않습니다.");
    }

    // 추론 기능 미지원 (reasoning 작업에서 supportsReasoning 필수가 아니므로 감점으로 처리 – 필터에서는 제외 안 함)

    // 코딩 점수 최소 기준
    if (
      CODING_TASK_TYPES.has(analysis.taskType) &&
      model.taskScores.coding < MINIMUM_CODING_SCORE
    ) {
      reasons.push(
        `코딩 작업에서 최소 기준(${MINIMUM_CODING_SCORE}점)을 충족하지 않습니다.`
      );
    }

    // 무료 전용 모드
    if (options.freeOnly && !model.isFreeExecutable) {
      reasons.push("무료 실행이 불가능한 모델입니다.");
    }

    if (reasons.length > 0) {
      excluded.push({ model, reasons });
    } else {
      eligible.push(model);
    }
  }

  return { eligible, excluded };
}
