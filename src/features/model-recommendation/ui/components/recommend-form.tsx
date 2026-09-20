"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { useRecommend } from "../hooks/use-recommend";
import { useAppStore } from "@/src/shared/lib/store";
import {
  copyPromptToClipboard,
  openPendingModelWindow,
  sendPreparedWindowToModel,
} from "../lib/model-handoff";

export function RecommendForm() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useRecommend();
  const setLastPrompt = useAppStore((s) => s.setLastPrompt);
  const promptId = useId();
  const errorId = useId();
  const statusId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("프롬프트를 입력해주세요.");
      return;
    }
    if (trimmedPrompt.length < 5) {
      setError("프롬프트가 너무 짧습니다. 5자 이상 입력해주세요.");
      return;
    }

    // 사용자 입력 이벤트 안에서 새 탭을 먼저 확보해야 브라우저 팝업 차단을
    // 피할 수 있다. 추천 응답이 온 뒤 이 탭을 실제 모델 페이지로 이동시킨다.
    const targetWindow = openPendingModelWindow();

    // 외부 AI 웹앱의 DOM에는 직접 접근할 수 없으므로 프롬프트는 먼저
    // 클립보드에 복사한다. 대상 페이지에서 바로 붙여넣어 사용할 수 있다.
    void copyPromptToClipboard(trimmedPrompt);

    setLastPrompt(trimmedPrompt);
    mutate(trimmedPrompt, {
      onSuccess: (data) => {
        const topRecommendation =
          data.recommendations.find((item) => item.rank === 1) ??
          data.recommendations[0];

        if (topRecommendation) {
          sendPreparedWindowToModel(targetWindow, topRecommendation.modelId);
        } else {
          targetWindow?.close();
        }

        const encoded = encodeURIComponent(JSON.stringify(data));
        router.push(`/recommend?result=${encoded}`);
      },
      onError: (err) => {
        targetWindow?.close();
        setError(err.message ?? "오류가 발생했습니다. 다시 시도해주세요.");
      },
    });
  }

  function handlePromptKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) {
      return;
    }

    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
      <div>
        <label
          htmlFor={promptId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          AI에게 요청할 내용을 입력하세요
        </label>
        <textarea
          id={promptId}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handlePromptKeyDown}
          placeholder="예: Python으로 REST API 서버를 만드는 방법을 단계별로 설명해줘"
          rows={5}
          disabled={isPending}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 resize-none transition"
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {error}
          </p>
        )}
      </div>

      <div
        id={statusId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isPending ? "모델을 분석 중입니다..." : ""}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            분석 중...
          </span>
        ) : (
          "AI 모델 추천받기"
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Enter로 실행 · Shift+Enter로 줄바꿈 · 실행 시 프롬프트를 복사하고 1위 추천 모델을 새 탭에서 엽니다.
      </p>
    </form>
  );
}
