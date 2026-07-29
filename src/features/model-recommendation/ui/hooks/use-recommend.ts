"use client";

import { useMutation } from "@tanstack/react-query";
import type { RecommendResponse } from "@/src/shared/validation/api.schema";

async function fetchRecommendations(prompt: string): Promise<RecommendResponse> {
  const res = await fetch("/api/models/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, mode: "all" }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "추천 요청에 실패했습니다.");
  }
  return data as RecommendResponse;
}

export function useRecommend() {
  return useMutation({
    mutationFn: fetchRecommendations,
  });
}
