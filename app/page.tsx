import { RecommendForm } from "@/src/features/model-recommendation/ui/components/recommend-form";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-10">
      {/* 헤로 섹션 */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          ModelFit
        </h1>
        <p className="text-lg text-gray-500">
          프롬프트를 입력하면 가장 적합한 AI 모델을 추천해드립니다.
        </p>
        <p className="text-sm text-gray-400">
          외부 API 키 없이 바로 사용 가능 · 비로그인 지원
        </p>
      </section>

      {/* 추천 폼 */}
      <section
        aria-label="AI 모델 추천 요청"
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
      >
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            실행 모드
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              적합한 모델만 추천받기
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm text-gray-400"
              aria-label="무료 모델로 답변받기 - 준비 중"
              title="Phase 2에서 제공 예정"
            >
              무료 모델로 답변받기
              <span className="text-xs bg-gray-200 text-gray-500 rounded px-1 ml-1">
                준비 중
              </span>
            </span>
          </div>
        </div>

        <RecommendForm />
      </section>

      {/* 사용 예시 */}
      <section aria-label="프롬프트 예시" className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          이런 요청을 입력해보세요
        </h2>
        <div className="grid gap-2">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.label}
              className="rounded-xl border border-gray-100 bg-white px-4 py-3"
            >
              <span className="text-xs font-medium text-indigo-500 mr-2">
                {ex.label}
              </span>
              <span className="text-sm text-gray-600">{ex.text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const EXAMPLES = [
  {
    label: "코딩",
    text: "Python으로 비동기 REST API 서버를 FastAPI로 구현하는 방법 알려줘",
  },
  {
    label: "번역",
    text: "이 영어 기술 문서를 자연스러운 한국어로 번역해줘",
  },
  {
    label: "추론",
    text: "GPT-4o와 Claude Sonnet의 장단점을 비교 분석해줘",
  },
  {
    label: "요약",
    text: "아래 논문을 핵심 포인트 5가지로 요약해줘",
  },
];
