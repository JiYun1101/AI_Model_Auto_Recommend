"use client";

import { create } from "zustand";

type ExecutionMode = "recommend" | "free_chat";

interface AppStore {
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;

  priorities: { quality: number; cost: number; speed: number };
  setPriorities: (p: { quality: number; cost: number; speed: number }) => void;

  lastPrompt: string;
  setLastPrompt: (prompt: string) => void;

  modelFilter: { provider?: string; free?: boolean; openWeight?: boolean };
  setModelFilter: (filter: AppStore["modelFilter"]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mode: "recommend",
  setMode: (mode) => set({ mode }),

  priorities: { quality: 0.5, cost: 0.3, speed: 0.2 },
  setPriorities: (priorities) => set({ priorities }),

  lastPrompt: "",
  setLastPrompt: (lastPrompt) => set({ lastPrompt }),

  modelFilter: {},
  setModelFilter: (modelFilter) => set({ modelFilter }),
}));
