"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { useRecommend } from "../hooks/use-recommend";
import { useAppStore } from "@/src/shared/lib/store";

const DEMO_PROMPTS = [
  {
    label: "코딩",
    text: "Next.js 로그인 처리에서 간헐적으로 세션이 풀리는 원인을 분석하고 수정 방향을 제안해줘",
  },
  {
    label: "리서치",
    text: "긴 기술 문서 여러 개를 비교해서 핵심 차이와 의사결정 포인트를 근거 중심으로 정리해줘",
  },
  {
    label: "빠른 작업",
    text: "신규 AI 서비스의 랜딩페이지 헤드라인을 짧고 명확하게 10개 만들어줘",
  },
] as const;

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

    setLastPrompt(trimmedPrompt);
    mutate(trimmedPrompt, {
      onSuccess: (data) => {
        const encoded = encodeURIComponent(JSON.stringify(data));
        router.push(`/recommend?result=${encoded}`);
      },
      onError: (err) => {
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

        <div className="mt-3 flex flex-wrap gap-2" aria-label="데모 프롬프트">
          {DEMO_PROMPTS.map((example) => (
            <button
              key={example.label}
              type="button"
              disabled={isPending}
              onClick={() => {
                setPrompt(example.text);
                setError("");
              }}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
            >
              {example.label} 예시
            </button>
          ))}
        </div>

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
        Enter로 추천 · Shift+Enter로 줄바꿈 · 외부 AI 페이지 이동은 추천 결과에서 직접 선택합니다.
      </p>
    </form>
  );
}
