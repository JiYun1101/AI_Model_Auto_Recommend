import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MODEL_NEWS_ITEMS,
  getModelNewsItem,
  type ModelNewsItem,
} from "@/src/features/model-news/domain/model-news";

const CATEGORY_LABELS: Record<ModelNewsItem["category"], string> = {
  model_release: "신규 모델",
  model_update: "모델 업데이트",
  pricing: "가격 변화",
  capability: "기능 업데이트",
  availability: "이용 범위",
};

export function generateStaticParams() {
  return MODEL_NEWS_ITEMS.map((item) => ({ id: item.id }));
}

export default async function ModelNewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getModelNewsItem(id);

  if (!item) {
    notFound();
  }

  const relatedItems = MODEL_NEWS_ITEMS.filter(
    (candidate) =>
      candidate.id !== item.id &&
      (candidate.provider === item.provider ||
        candidate.tags.some((tag) => item.tags.includes(tag)))
  ).slice(0, 3);

  return (
    <article className="pb-20">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-7 sm:px-6 sm:pb-14 sm:pt-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-indigo-600"
          >
            ← 모델 뉴스
          </Link>

          <div className="mt-7 overflow-hidden rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-100 via-violet-50 to-white">
            <div className="grid min-h-[380px] lg:grid-cols-[1.35fr_0.65fr]">
              <div className="flex flex-col justify-end p-7 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-gray-900 px-3 py-1.5 text-white">
                    {item.provider}
                  </span>
                  <span className="rounded-full bg-white/80 px-3 py-1.5 text-indigo-700 ring-1 ring-indigo-100">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  {item.featured && (
                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                      주목 업데이트
                    </span>
                  )}
                </div>

                <h1 className="mt-6 max-w-3xl text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl">
                  {item.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                  {item.subtitle}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <time>{formatDate(item.publishedAt)}</time>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{item.modelNames.join(" · ")}</span>
                </div>
              </div>

              <div className="relative hidden overflow-hidden border-l border-white/60 p-8 lg:block">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-indigo-200/70" />
                <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/70" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-indigo-400">
                    ModelFit Brief
                  </span>
                  <div>
                    <p className="text-xs font-bold text-indigo-400">MODEL UPDATE</p>
                    <p className="mt-2 break-words text-3xl font-black leading-tight text-gray-900">
                      {item.modelNames[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
        <section className="rounded-2xl bg-indigo-50 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-500">
            30초 요약
          </p>
          <p className="mt-3 text-base font-medium leading-8 text-gray-800">
            {item.summary}
          </p>
        </section>

        <div className="mt-12 space-y-14">
          {item.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-5">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[16px] leading-8 text-gray-700 sm:text-[17px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950">
              뭐가 달라졌어?
            </h2>
            <div className="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-5">
              {item.changes.map((change, index) => (
                <div key={change} className="flex gap-4 py-5">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-50 text-xs font-black text-indigo-600">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-gray-700">{change}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-gray-950 p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">
              ModelFit Pick
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">이럴 때 추천해요</h2>
            <ul className="mt-6 space-y-4">
              {item.recommendedFor.map((useCase) => (
                <li key={useCase} className="flex gap-3 text-sm leading-7 text-gray-200">
                  <span className="font-black text-indigo-300">✓</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <p className="text-sm leading-7 text-gray-500">
              ModelFit 뉴스는 모델 제조사의 공식 발표를 바탕으로 핵심 변화와
              추천 상황을 다시 정리합니다. 실제 추천 점수에는 검증되지 않은
              마케팅 표현을 바로 반영하지 않습니다.
            </p>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:underline"
            >
              공식 발표 원문 보기 ↗
            </a>
          </section>
        </div>

        {relatedItems.length > 0 && (
          <aside className="mt-16 border-t border-gray-200 pt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-500">
                  Keep Reading
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-gray-950">
                  이어서 볼 모델 뉴스
                </h2>
              </div>
              <Link
                href="/news"
                className="text-xs font-semibold text-gray-400 hover:text-indigo-600"
              >
                전체 보기 →
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {relatedItems.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${related.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white px-5 py-5 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                    <span>{related.provider}</span>
                    <span>·</span>
                    <span>{formatDate(related.publishedAt)}</span>
                  </div>
                  <p className="mt-2 text-base font-bold leading-6 text-gray-900 group-hover:text-indigo-700">
                    {related.title}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00+09:00`));
}
