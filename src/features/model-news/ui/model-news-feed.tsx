"use client";

import { useMemo, useState } from "react";
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
    <div className="space-y-8">
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
        <div className="space-y-5">
          {filteredItems.map((item) => (
            <NewsCard key={item.id} item={item} onSelectTag={setTag} />
          ))}
        </div>
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
    </div>
  );
}

function NewsCard({
  item,
  onSelectTag,
}: {
  item: ModelNewsItem;
  onSelectTag: (tag: NewsTagFilter) => void;
}) {
  return (
    <article
      className={
        item.featured
          ? "overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm ring-1 ring-indigo-50"
          : "overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
      }
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-gray-900 px-2.5 py-1 text-white">
            {item.provider}
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
            {CATEGORY_LABELS[item.category]}
          </span>
          {item.featured && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
              주목 업데이트
            </span>
          )}
          <time className="ml-auto text-gray-400">
            {formatDate(item.publishedAt)}
          </time>
        </div>

        <div className="mt-5">
          <h2 className="text-xl font-bold leading-8 text-gray-950 sm:text-2xl">
            {item.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">{item.subtitle}</p>
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            30초 요약
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-700">{item.summary}</p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section>
            <h3 className="text-sm font-bold text-gray-900">뭐가 달라졌어?</h3>
            <ul className="mt-3 space-y-2">
              {item.changes.map((change) => (
                <li
                  key={change}
                  className="flex gap-2 text-sm leading-6 text-gray-600"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-indigo-500" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900">이럴 때 추천</h3>
            <ul className="mt-3 space-y-2">
              {item.recommendedFor.map((useCase) => (
                <li
                  key={useCase}
                  className="flex gap-2 text-sm leading-6 text-gray-600"
                >
                  <span aria-hidden="true">✓</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="flex flex-wrap gap-2">
            {item.modelNames.map((modelName) => (
              <span
                key={modelName}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800"
              >
                {modelName}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
            {item.tags.map((itemTag) => {
              const filterTag = toNewsTagFilter(itemTag);

              return filterTag ? (
                <button
                  key={itemTag}
                  type="button"
                  className="text-xs font-medium text-indigo-500 hover:text-indigo-700 hover:underline"
                  onClick={() => onSelectTag(filterTag)}
                >
                  {itemTag}
                </button>
              ) : (
                <span
                  key={itemTag}
                  className="text-xs font-medium text-indigo-400"
                >
                  {itemTag}
                </span>
              );
            })}
          </div>

          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-indigo-600"
          >
            공식 발표 원문 보기
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function toNewsTagFilter(tag: string): NewsTagFilter | null {
  return NEWS_TAG_FILTERS.find((filter) => filter === tag) ?? null;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00+09:00`));
}
