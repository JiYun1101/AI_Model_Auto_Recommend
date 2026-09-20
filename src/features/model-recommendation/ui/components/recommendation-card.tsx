"use client";

import { useState } from "react";
import { Badge } from "@/src/shared/components/badge";
import { useFeedback } from "@/src/features/feedback/ui/hooks/use-feedback";
import type { ModelRecommendation } from "@/src/shared/validation/recommendation.schema";
import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";
import {
  copyPromptToClipboard,
  getModelWebUrl,
} from "../lib/model-handoff";
import { clsx } from "clsx";

const TYPE_LABELS: Record<ModelRecommendation["recommendationType"], string> = {
  best: "가장 적합",
  free_alternative: "무료 대안",
  fast_economy: "빠른 경제형",
};

const TYPE_VARIANTS: Record<
  ModelRecommendation["recommendationType"],
  "blue" | "green" | "orange"
> = {
  best: "blue",
  free_alternative: "green",
  fast_economy: "orange",
};

const TYPE_DESCRIPTIONS: Record<
  ModelRecommendation["recommendationType"],
  string
> = {
  best: "품질과 적합성 우선",
  free_alternative: "무료·오픈 실행 가능",
  fast_economy: "속도·비용 최적화",
};

interface Props {
  recommendation: ModelRecommendation;
  model?: ModelProfile;
  prompt?: string;
}

export function RecommendationCard({ recommendation, model, prompt }: Props) {
  const [feedbackSent, setFeedbackSent] = useState<"helpful" | "not_helpful" | null>(null);
  const [handoffStatus, setHandoffStatus] = useState<
    "opened" | "copied" | "copy_failed" | null
  >(null);
  const { mutate: sendFeedback, isPending: isSending } = useFeedback();

  function handleFeedback(result: "helpful" | "not_helpful") {
    if (feedbackSent) return;
    sendFeedback(
      { modelId: recommendation.modelId, result },
      { onSuccess: () => setFeedbackSent(result) }
    );
  }

  async function handleHandoff() {
    if (!prompt) return;

    const webUrl = getModelWebUrl(recommendation.modelId);

    // 클릭 이벤트 안에서 바로 열어야 팝업 차단 가능성이 가장 낮다.
    if (webUrl) {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }

    const copied = await copyPromptToClipboard(prompt);
    if (!copied) {
      setHandoffStatus("copy_failed");
      return;
    }

    setHandoffStatus(webUrl ? "opened" : "copied");
  }

  const scorePercent = Math.min(100, Math.max(0, recommendation.score));
  const webUrl = getModelWebUrl(recommendation.modelId);

  return (
    <article
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4"
      aria-label={`추천 ${recommendation.rank}순위: ${recommendation.modelId}`}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-bold text-gray-400 uppercase tracking-wide"
            aria-label={`추천 순위 ${recommendation.rank}`}
          >
            #{recommendation.rank}
          </span>
          <Badge variant={TYPE_VARIANTS[recommendation.recommendationType]}>
            {TYPE_LABELS[recommendation.recommendationType]}
          </Badge>
          <span className="text-xs text-gray-500">
            {TYPE_DESCRIPTIONS[recommendation.recommendationType]}
          </span>
        </div>
        {/* 적합도 점수 */}
        <div
          className="flex items-center gap-1.5 flex-shrink-0"
          title={`적합도 점수: ${scorePercent}점`}
        >
          <div
            className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={scorePercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`적합도 ${scorePercent}점`}
          >
            <div
              className={clsx(
                "h-full rounded-full",
                scorePercent >= 80
                  ? "bg-green-500"
                  : scorePercent >= 60
                  ? "bg-yellow-500"
                  : "bg-red-400"
              )}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600">
            {scorePercent}
          </span>
        </div>
      </div>

      {/* 모델 이름 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {model?.displayName ?? recommendation.modelId}
        </h3>
        {model && (
          <p className="text-xs text-gray-500 mt-0.5">
            {model.provider} · {model.family}
          </p>
        )}
      </div>

      {/* 접근 방법 */}
      <div
        className="flex flex-wrap gap-1.5"
        aria-label="사용 가능한 접근 방법"
      >
        {recommendation.access.freeAvailable && (
          <Badge variant="green">무료 실행 가능</Badge>
        )}
        {recommendation.access.webAvailable && (
          <Badge variant="blue">웹</Badge>
        )}
        {recommendation.access.apiAvailable && (
          <Badge variant="purple">API</Badge>
        )}
        {recommendation.access.localAvailable && (
          <Badge variant="orange">로컬</Badge>
        )}
        {model?.isOpenWeight && (
          <Badge variant="yellow">오픈 가중치</Badge>
        )}
      </div>

      {/* 바로 실행 */}
      {prompt && (
        <section
          aria-label="추천 모델에서 프롬프트 실행"
          className="rounded-xl bg-indigo-50 border border-indigo-100 p-3"
        >
          <button
            type="button"
            onClick={handleHandoff}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            {webUrl ? "프롬프트 복사 + 이 모델 열기 ↗" : "프롬프트 복사"}
          </button>
          <p className="mt-2 text-xs text-indigo-600">
            {webUrl
              ? "새 탭에서 모델을 열고, 작성한 프롬프트는 클립보드에 복사합니다."
              : "이 모델은 바로 열 수 있는 공식 웹 채팅 경로가 없어 프롬프트만 복사합니다."}
          </p>
          {handoffStatus && (
            <p
              className={clsx(
                "mt-1 text-xs font-medium",
                handoffStatus === "copy_failed" ? "text-red-600" : "text-green-700"
              )}
              aria-live="polite"
            >
              {handoffStatus === "opened" &&
                "모델 페이지를 열었습니다. 입력창에 붙여넣기만 하면 됩니다."}
              {handoffStatus === "copied" &&
                "프롬프트를 복사했습니다."}
              {handoffStatus === "copy_failed" &&
                "자동 복사에 실패했습니다. 브라우저의 클립보드 권한을 확인해주세요."}
            </p>
          )}
        </section>
      )}

      {/* 마지막 확인일 */}
      {model?.lastVerifiedAt && (
        <p className="text-xs text-gray-400">
          정보 확인일:{" "}
          {new Date(model.lastVerifiedAt).toLocaleDateString("ko-KR")}
        </p>
      )}

      {/* 추천 이유 */}
      <section aria-label="추천 이유">
        <h4 className="text-sm font-semibold text-gray-700 mb-1.5">
          추천 이유
        </h4>
        <ul className="space-y-1">
          {recommendation.reasons.map((reason, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600">
              <span className="text-green-500 flex-shrink-0" aria-hidden="true">
                ✓
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </section>

      {/* 한계 */}
      {recommendation.limitations.length > 0 && (
        <section aria-label="한계">
          <h4 className="text-sm font-semibold text-gray-700 mb-1.5">
            한계 및 주의사항
          </h4>
          <ul className="space-y-1">
            {recommendation.limitations.map((lim, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-500">
                <span
                  className="text-amber-400 flex-shrink-0"
                  aria-hidden="true"
                >
                  ⚠
                </span>
                {lim}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 피드백 */}
      <div className="pt-2 border-t border-gray-100">
        {feedbackSent ? (
          <p className="text-sm text-gray-500" aria-live="polite">
            {feedbackSent === "helpful"
              ? "도움이 됐다고 평가해주셨습니다. 감사합니다!"
              : "피드백을 보내주셨습니다. 개선하겠습니다."}
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">이 추천이 도움이 됐나요?</span>
            <button
              type="button"
              onClick={() => handleFeedback("helpful")}
              disabled={isSending}
              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-green-400 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 transition"
              aria-label={`${recommendation.modelId} 추천 - 도움 됨`}
            >
              👍 도움 됨
            </button>
            <button
              type="button"
              onClick={() => handleFeedback("not_helpful")}
              disabled={isSending}
              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 transition"
              aria-label={`${recommendation.modelId} 추천 - 적합하지 않음`}
            >
              👎 적합하지 않음
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
