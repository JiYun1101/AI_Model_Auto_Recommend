"use client";

import { useMemo, useState } from "react";
import {
  MODEL_NEWS_ITEMS,
  NEWS_PROVIDER_FILTERS,
  type ModelNewsItem,
} from "../domain/model-news";

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

  const filteredItems = useMemo(
    () =>
      provider === "전체"
        ? MODEL_NEWS_ITEMS
        : MODEL_NEWS_ITEMS.filter((item) => item.provider === provider),
    [provider]
  );

  return (
    <div className="space-y-8">
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

      <div className="space-y-5">
        {filteredItems.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: ModelNewsItem }) {
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
          <time className="ml-auto text-gray-400">{formatDate(item.publishedAt)}</time>
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
                <li key={change} className="flex gap-2 text-sm leading-6 text-gray-600">
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
                <li key={useCase} className="flex gap-2 text-sm leading-6 text-gray-600">
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
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium text-indigo-500">
                {tag}
              </span>
            ))}
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00+09:00`));
}
