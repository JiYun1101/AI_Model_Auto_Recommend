"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MODEL_NEWS_ITEMS,
  NEWS_PROVIDER_FILTERS,
  NEWS_TAG_FILTERS,
  type ModelNewsItem,
} from "../domain/model-news";

type NewsTagFilter = (typeof NEWS_TAG_FILTERS)[number];

const CATEGORY_LABELS: Record<ModelNewsItem["category"], string> = {
  model_release: "신규 모델",
  model_update: "모델 업데이트",
  pricing: "가격 변화",
  capability: "기능 업데이트",
  availability: "이용 범위",
};

export function ModelNewsFeed() {
  const [provider, setProvider] =
    useState<(typeof NEWS_PROVIDER_FILTERS)[number]>("전체");
  const [tag, setTag] = useState<NewsTagFilter>("전체");

  const filteredItems = useMemo(
    () =>
      MODEL_NEWS_ITEMS.filter((item) => {
        const providerMatches =
          provider === "전체" || item.provider === provider;
        const tagMatches = tag === "전체" || item.tags.includes(tag);

        return providerMatches && tagMatches;
      }).sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [provider, tag]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {NEWS_PROVIDER_FILTERS.map((item) => {
            const selected = provider === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setProvider(item)}
                className={
                  selected
                    ? "whitespace-nowrap rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                    : "whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-800"
                }
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {NEWS_TAG_FILTERS.map((item) => {
            const selected = tag === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                className={
                  selected
                    ? "whitespace-nowrap text-xs font-bold text-indigo-700"
                    : "whitespace-nowrap text-xs font-medium text-gray-400 hover:text-indigo-600"
                }
              >
                {item === "전체" ? "#전체주제" : item}
              </button>
            );
          })}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <InfiniteNewsRail items={filteredItems} />
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-gray-700">
            이 조건의 모델 뉴스가 아직 없어요.
          </p>
          <button
            type="button"
            onClick={() => {
              setProvider("전체");
              setTag("전체");
            }}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
          >
            필터 초기화
          </button>
        </div>
      )}

      <p className="text-xs leading-5 text-gray-400">
        좌우로 스크롤해서 업데이트를 훑어보고, 원하는 뉴스를 클릭하면 전체
        내용을 읽을 수 있어요.
      </p>
    </div>
  );
}

function InfiniteNewsRail({ items }: { items: ModelNewsItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const repeatedItems = items.length > 1 ? [...items, ...items, ...items] : items;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || items.length <= 1) return;

    const moveToMiddleCopy = () => {
      const segmentWidth = rail.scrollWidth / 3;
      rail.scrollLeft = segmentWidth;
    };

    const frame = requestAnimationFrame(moveToMiddleCopy);
    return () => cancelAnimationFrame(frame);
  }, [items]);

  function handleScroll() {
    const rail = railRef.current;
    if (!rail || items.length <= 1) return;

    const segmentWidth = rail.scrollWidth / 3;
    if (!segmentWidth) return;

    if (rail.scrollLeft < segmentWidth * 0.35) {
      rail.scrollLeft += segmentWidth;
    } else if (rail.scrollLeft > segmentWidth * 1.65) {
      rail.scrollLeft -= segmentWidth;
    }
  }

  return (
    <div
      ref={railRef}
      onScroll={handleScroll}
      className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6"
      aria-label="모델 뉴스 목록"
    >
      {repeatedItems.map((item, index) => (
        <NewsListCard
          key={`${item.id}-${index}`}
          item={item}
          duplicate={items.length > 1 && (index < items.length || index >= items.length * 2)}
        />
      ))}
    </div>
  );
}

function NewsListCard({
  item,
  duplicate,
}: {
  item: ModelNewsItem;
  duplicate: boolean;
}) {
  return (
    <Link
      href={`/news/${item.id}`}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className="group w-[82vw] max-w-[620px] flex-none snap-start overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:w-[560px]"
    >
      <article className="grid min-h-[260px] grid-cols-[1fr_120px] sm:grid-cols-[1fr_180px]">
        <div className="flex min-w-0 flex-col p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
            <span className="rounded-full bg-gray-900 px-2.5 py-1 text-white">
              {item.provider}
            </span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
              {CATEGORY_LABELS[item.category]}
            </span>
            <time className="text-gray-400">{formatDate(item.publishedAt)}</time>
          </div>

          <h2 className="mt-5 line-clamp-3 text-xl font-extrabold leading-8 tracking-tight text-gray-950 transition group-hover:text-indigo-700 sm:text-2xl">
            {item.title}
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
            {item.summary}
          </p>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {item.tags.slice(0, 3).map((itemTag) => (
              <span key={itemTag} className="text-xs font-medium text-indigo-500">
                {itemTag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-violet-50 to-white p-4 sm:p-5">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-indigo-200/60" />
          <div className="absolute -bottom-10 -left-5 h-28 w-28 rounded-full bg-white/60" />

          <div className="relative flex h-full flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
              ModelFit Brief
            </span>
            <div>
              <p className="text-xs font-semibold text-gray-400">MODEL</p>
              <p className="mt-1 break-words text-sm font-black leading-5 text-gray-900 sm:text-lg">
                {item.modelNames[0]}
              </p>
              <span className="mt-4 inline-flex text-lg text-indigo-600 transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00+09:00`));
}
