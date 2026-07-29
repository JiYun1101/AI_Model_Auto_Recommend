"use client";

import { useQuery } from "@tanstack/react-query";
import type { ModelProfile } from "@/src/shared/validation/model-profile.schema";

async function fetchModels(params: {
  provider?: string;
  free?: boolean;
  status?: string;
}): Promise<{ models: ModelProfile[]; count: number }> {
  const sp = new URLSearchParams();
  if (params.provider) sp.set("provider", params.provider);
  if (params.free !== undefined) sp.set("free", String(params.free));
  if (params.status) sp.set("status", params.status);

  const res = await fetch(`/api/models?${sp.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "모델 목록 조회 실패");
  return data as { models: ModelProfile[]; count: number };
}

export function useModels(params: Parameters<typeof fetchModels>[0] = {}) {
  return useQuery({
    queryKey: ["models", params],
    queryFn: () => fetchModels(params),
  });
}
