"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RecommendationCard } from "@/src/features/model-recommendation/ui/components/recommendation-card";
import { Badge } from "@/src/shared/components/badge";
import type { RecommendResponse } from "@/src/shared/validation/api.schema";
import Link from "next/link";

const TASK_LABELS: Record<string, string> = {
  general: "일반 질문",
  coding: "코딩",
  debugging: "디버깅",
  reasoning: "추론·분석",
  writing: "글쓰기",
  translation: "번역",
  summarization: "요약",
  research: "조사·연구",
  data_extraction: "데이터 추출",
  planning: "계획 수립",
};

const COMPLEXITY_LABELS: Record<string, string> = {
  simple: "간단",
  standard: "보통",
  complex: "복잡",
};

const CAPABILITY_LABELS: Record<string, string> = {
  long_context: "긴 컨텍스트",
  vision: "이미지 입력",
  tool_calling: "도구 호출",
  structured_output: "구조화 출력",
  reasoning: "추론",
  coding: "코딩",
  multilingual: "다국어",
};

function RecommendResultContent() {
  const params = useSearchParams();
  const raw = params.get("result");

  if (!raw) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">추천 결과가 없습니다.</p>
        <Link
          href="/"
          className="text-indigo-600 hover:underline text-sm font-medium"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  let data: RecommendResponse;
  try {
    data = JSON.parse(decodeURIComponent(raw)) as RecommendResponse;
  } catch {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-500">결과를 불러오는 중 오류가 발생했습니다.</p>
        <Link href="/" className="text-indigo-600 hover:underline text-sm">
          다시 시도하기
        </Link>
      </div>
    );
  }

  const { analysis, recommendations, metadata } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* 분석 결과 요약 */}
      <section
        aria-label="프롬프트 분석 결과"
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4"
      >
        <h2 className="text-base font-semibold text-gray-800">
          프롬프트 분석 결과
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">작업 유형</p>
            <Badge variant="blue">
              {TASK_LABELS[analysis.taskType] ?? analysis.taskType}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">난이도</p>
            <Badge
              variant={
                analysis.complexity === "complex"
                  ? "orange"
                  : analysis.complexity === "standard"
                  ? "blue"
                  : "green"
              }
            >
              {COMPLEXITY_LABELS[analysis.complexity] ?? analysis.complexity}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">분석 신뢰도</p>
            <span className="text-sm font-semibold text-gray-700">
              {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">검토 모델</p>
            <span className="text-sm font-semibold text-gray-700">
              {metadata.evaluatedModelCount}개 중{" "}
              {metadata.eligibleModelCount}개 적합
            </span>
          </div>
        </div>

        {analysis.requiredCapabilities.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">필요한 기능</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.requiredCapabilities.map((cap) => (
                <Badge key={cap} variant="purple">
                  {CAPABILITY_LABELS[cap] ?? cap}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.reasons.length > 0 && (
          <details className="text-xs text-gray-400 cursor-pointer">
            <summary className="hover:text-gray-600 transition-colors">
              분석 근거 보기
            </summary>
            <ul className="mt-2 space-y-0.5 pl-2">
              {analysis.reasons.map((r, i) => (
                <li key={i}>· {r}</li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {/* 추천 결과 */}
      <section aria-label="추천 모델 목록">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          추천 모델 ({recommendations.length}개)
        </h2>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.modelId} recommendation={rec} />
          ))}
        </div>
      </section>

      {/* 다시 시도 */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          ← 다른 프롬프트로 다시 추천받기
        </Link>
      </div>
    </div>
  );
}

export default function RecommendPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">결과를 불러오는 중...</p>
        </div>
      }
    >
      <RecommendResultContent />
    </Suspense>
  );
}
