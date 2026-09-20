"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AiTypeId } from "@/src/features/ai-profile/domain/ai-type";

type ExecutionMode = "recommend" | "free_chat";

type Priorities = { quality: number; cost: number; speed: number };

interface AppStore {
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;

  priorities: Priorities;
  setPriorities: (p: Priorities) => void;

  aiType: AiTypeId | null;
  setAiType: (aiType: AiTypeId, priorities: Priorities) => void;

  lastPrompt: string;
  setLastPrompt: (prompt: string) => void;

  modelFilter: { provider?: string; free?: boolean; openWeight?: boolean };
  setModelFilter: (filter: AppStore["modelFilter"]) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      mode: "recommend",
      setMode: (mode) => set({ mode }),

      priorities: { quality: 0.5, cost: 0.3, speed: 0.2 },
      setPriorities: (priorities) => set({ priorities }),

      aiType: null,
      setAiType: (aiType, priorities) => set({ aiType, priorities }),

      lastPrompt: "",
      setLastPrompt: (lastPrompt) => set({ lastPrompt }),

      modelFilter: {},
      setModelFilter: (modelFilter) => set({ modelFilter }),
    }),
    {
      name: "modelfit-profile",
      partialize: (state) => ({
        priorities: state.priorities,
        aiType: state.aiType,
      }),
    }
  )
);
