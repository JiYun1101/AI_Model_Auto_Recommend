import { ModelNewsFeed } from "@/src/features/model-news/ui/model-news-feed";

export default function ModelNewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">
          <span>ModelFit Brief</span>
          <span className="h-1 w-1 rounded-full bg-indigo-300" />
          <span>AI Model Update</span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
          모델 뉴스
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
          새 모델이 나올 때마다 벤치마크 숫자만 보는 대신,
          <span className="font-semibold text-gray-700">
            {" "}무엇이 바뀌었고 어떤 상황에서 쓰면 좋은지
          </span>
          를 짧게 정리합니다.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-gray-200">
            공식 발표 기반
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-gray-200">
            추천 상황 요약
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-gray-200">
            모델별 해시태그
          </span>
        </div>
      </header>

      <ModelNewsFeed />

      <aside className="mt-10 rounded-2xl border border-gray-200 bg-gray-100/70 px-5 py-4 text-xs leading-5 text-gray-500">
        ModelFit 뉴스는 제조사 공식 발표와 릴리즈 노트를 우선 기준으로 요약합니다.
        모델 성능 평가는 실제 추천 카탈로그 및 사용자 피드백과 분리해 관리하고,
        확인되지 않은 마케팅 표현을 추천 점수에 바로 반영하지 않습니다.
      </aside>
    </div>
  );
}
