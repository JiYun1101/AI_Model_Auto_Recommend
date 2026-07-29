"use client";

import { useState } from "react";
import { useModels } from "@/src/features/model-catalog/ui/hooks/use-models";
import { Badge } from "@/src/shared/components/badge";
import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";

const TASK_LABELS: Record<keyof ModelProfile["taskScores"], string> = {
  general: "일반",
  coding: "코딩",
  reasoning: "추론",
  writing: "글쓰기",
  translation: "번역",
  summarization: "요약",
  longContext: "긴 컨텍스트",
};

function getBestTask(scores: ModelProfile["taskScores"]): string {
  const best = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  return best ? (TASK_LABELS[best[0] as keyof typeof scores] ?? best[0]) : "-";
}

function StatusBadge({ status }: { status: ModelProfile["status"] }) {
  const config = {
    active: { label: "활성", variant: "green" as const },
    preview: { label: "프리뷰", variant: "yellow" as const },
    deprecated: { label: "deprecated", variant: "gray" as const },
    unavailable: { label: "비활성", variant: "gray" as const },
  };
  const { label, variant } = config[status] ?? { label: status, variant: "gray" as const };
  return <Badge variant={variant}>{label}</Badge>;
}

export default function ModelsPage() {
  const [filter, setFilter] = useState<{
    provider?: string;
    free?: boolean;
    openWeight?: boolean;
  }>({});

  const { data, isLoading, error } = useModels(filter);

  const providers = data
    ? [...new Set(data.models.map((m) => m.provider))].sort()
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">AI 모델 목록</h1>

      {/* 필터 */}
      <section
        aria-label="모델 필터"
        className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center"
      >
        <div>
          <label
            htmlFor="provider-filter"
            className="text-xs text-gray-500 mr-1.5"
          >
            공급자
          </label>
          <select
            id="provider-filter"
            value={filter.provider ?? ""}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                provider: e.target.value || undefined,
              }))
            }
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">전체</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.free ?? false}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                free: e.target.checked || undefined,
              }))
            }
            className="rounded focus:ring-indigo-400"
          />
          무료 실행 가능
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.openWeight ?? false}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                openWeight: e.target.checked || undefined,
              }))
            }
            className="rounded focus:ring-indigo-400"
          />
          오픈 가중치
        </label>
        {(filter.provider || filter.free || filter.openWeight) && (
          <button
            type="button"
            onClick={() => setFilter({})}
            className="text-xs text-gray-400 hover:text-gray-600 underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          >
            필터 초기화
          </button>
        )}
      </section>

      {/* 상태 메시지 */}
      {isLoading && (
        <p className="text-sm text-gray-500" aria-live="polite">
          모델 목록을 불러오는 중...
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error.message}
        </p>
      )}

      {/* 모델 카드 그리드 */}
      {data && (
        <>
          <p className="text-sm text-gray-500">{data.count}개 모델</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.models.map((model) => (
              <article
                key={model.id}
                className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 shadow-sm"
                aria-label={model.displayName}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm">
                      {model.displayName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {model.provider} · {model.family}
                    </p>
                  </div>
                  <StatusBadge status={model.status} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {model.isFreeExecutable && (
                    <Badge variant="green">무료</Badge>
                  )}
                  {model.isOpenWeight && (
                    <Badge variant="yellow">오픈 가중치</Badge>
                  )}
                  {model.accessType.includes("local") && (
                    <Badge variant="orange">로컬</Badge>
                  )}
                </div>

                <div className="text-xs text-gray-600 space-y-0.5">
                  <p>
                    <span className="text-gray-400">추천 작업:</span>{" "}
                    {getBestTask(model.taskScores)}
                  </p>
                  {model.contextWindow && (
                    <p>
                      <span className="text-gray-400">컨텍스트:</span>{" "}
                      {(model.contextWindow / 1000).toFixed(0)}K 토큰
                    </p>
                  )}
                  <p>
                    <span className="text-gray-400">정보 확인일:</span>{" "}
                    {new Date(model.lastVerifiedAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
