"use client";

import { useMutation } from "@tanstack/react-query";
import type { FeedbackRequest } from "@/src/shared/validation/api.schema";

async function sendFeedback(data: FeedbackRequest) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? "피드백 전송 실패");
  return json;
}

export function useFeedback() {
  return useMutation({ mutationFn: sendFeedback });
}
