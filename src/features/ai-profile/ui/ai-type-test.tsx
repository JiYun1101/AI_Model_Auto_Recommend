"use client";

import { useState } from "react";
import {
  AI_TYPE_PROFILES,
  AI_TYPE_QUESTIONS,
  calculateAiType,
  type AiTypeAnswer,
  type AiTypeProfile,
} from "../domain/ai-type";
import { useAppStore } from "@/src/shared/lib/store";

export function AiTypeTest() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AiTypeAnswer[]>([]);
  const [result, setResult] = useState<AiTypeProfile | null>(null);

  const aiType = useAppStore((state) => state.aiType);
  const setAiType = useAppStore((state) => state.setAiType);
  const savedProfile = aiType ? AI_TYPE_PROFILES[aiType] : null;

  function startTest() {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setOpen(true);
  }

  function selectAnswer(answer: AiTypeAnswer) {
    const nextAnswers = [...answers, answer];

    if (step === AI_TYPE_QUESTIONS.length - 1) {
      const profile = calculateAiType(nextAnswers);
      setAnswers(nextAnswers);
      setResult(profile);
      setAiType(profile.id, profile.priorities);
      return;
    }

    setAnswers(nextAnswers);
    setStep((current) => current + 1);
  }

  function closeModal() {
    setOpen(false);
  }

  const question = AI_TYPE_QUESTIONS[step];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (savedProfile) {
            setResult(savedProfile);
            setOpen(true);
            return;
          }
          startTest();
        }}
        className="fixed left-4 bottom-4 z-30 flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="AI 사용 유형 테스트 열기"
      >
        <span aria-hidden="true">{savedProfile?.emoji ?? "✨"}</span>
        <span>{savedProfile ? savedProfile.title : "AI 유형 테스트"}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="AI 사용 유형 테스트"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeModal();
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  ModelFit Personalization
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  AI 사용 유형 테스트
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            {result ? (
              <ResultView
                profile={result}
                onRetest={startTest}
                onClose={closeModal}
              />
            ) : (
              <div className="mt-7">
                <div className="mb-5 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {step + 1} / {AI_TYPE_QUESTIONS.length}
                  </span>
                  <span>30초면 끝나요</span>
                </div>

                <div
                  className="mb-7 h-1.5 overflow-hidden rounded-full bg-gray-100"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{
                      width: `${((step + 1) / AI_TYPE_QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>

                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  {question.question}
                </h3>

                <div className="mt-5 space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => selectAnswer(option.score)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm leading-6 text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span className="mr-2 font-semibold text-indigo-500">
                        {index === 0 ? "A" : "B"}.
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((current) => current.slice(0, -1));
                      setStep((current) => Math.max(0, current - 1));
                    }}
                    className="mt-5 text-xs font-medium text-gray-400 hover:text-indigo-600"
                  >
                    ← 이전 질문
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ResultView({
  profile,
  onRetest,
  onClose,
}: {
  profile: AiTypeProfile;
  onRetest: () => void;
  onClose: () => void;
}) {
  const bars = [
    { label: "품질", value: profile.priorities.quality },
    { label: "비용 효율", value: profile.priorities.cost },
    { label: "속도", value: profile.priorities.speed },
  ];

  return (
    <div className="mt-7">
      <div className="rounded-2xl bg-indigo-50 p-5 text-center">
        <div className="text-4xl" aria-hidden="true">
          {profile.emoji}
        </div>
        <p className="mt-2 text-xs font-semibold text-indigo-500">
          나의 AI 사용 유형
        </p>
        <h3 className="mt-1 text-2xl font-bold text-gray-900">
          {profile.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {profile.summary}
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 text-gray-600">
        {profile.description}
      </p>

      <div className="mt-5 space-y-3">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">{bar.label}</span>
              <span className="text-gray-400">
                {Math.round(bar.value * 100)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${bar.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {profile.traits.map((trait) => (
          <span
            key={trait}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
          >
            {trait}
          </span>
        ))}
      </div>

      <div className="mt-7 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-xs leading-5 text-green-700">
        이 결과는 저장되어 다음 모델 추천의 품질·비용·속도 가중치에 자동 반영됩니다.
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onRetest}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          다시 테스트
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          추천에 적용하기
        </button>
      </div>
    </div>
  );
}
