"use client";

import { useMutation } from "@tanstack/react-query";
import type { RecommendResponse } from "@/src/shared/validation/api.schema";
import { useAppStore } from "@/src/shared/lib/store";

async function fetchRecommendations(
  prompt: string,
  priorities: { quality: number; cost: number; speed: number }
): Promise<RecommendResponse> {
  const res = await fetch("/api/models/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, mode: "all", priorities }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "추천 요청에 실패했습니다.");
  }
  return data as RecommendResponse;
}

export function useRecommend() {
  const priorities = useAppStore((state) => state.priorities);

  return useMutation({
    mutationFn: (prompt: string) => fetchRecommendations(prompt, priorities),
  });
}
