"use client";

const MODEL_WEB_TARGETS: Array<{
  matches: (modelId: string) => boolean;
  url: string;
}> = [
  {
    matches: (modelId) => modelId.startsWith("openai/"),
    url: "https://chatgpt.com/",
  },
  {
    matches: (modelId) => modelId.startsWith("anthropic/"),
    url: "https://claude.ai/new",
  },
  {
    matches: (modelId) => modelId.startsWith("google/gemini-"),
    url: "https://gemini.google.com/app",
  },
  {
    matches: (modelId) => modelId.startsWith("deepseek/"),
    url: "https://chat.deepseek.com/",
  },
  {
    matches: (modelId) => modelId.startsWith("mistral/"),
    url: "https://chat.mistral.ai/chat",
  },
];

export function getModelWebUrl(modelId: string): string | null {
  return MODEL_WEB_TARGETS.find((target) => target.matches(modelId))?.url ?? null;
}

export async function copyPromptToClipboard(prompt: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    await navigator.clipboard.writeText(prompt);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copied;
    } catch {
      return false;
    }
  }
}

export function openPendingModelWindow(): Window | null {
  if (typeof window === "undefined") return null;

  const target = window.open("", "_blank");
  if (!target) return null;

  target.document.title = "ModelFit";
  if (target.document.body) {
    target.document.body.innerHTML = `
      <main style="font-family: system-ui, sans-serif; padding: 48px; color: #374151;">
        <h1 style="font-size: 20px; margin-bottom: 8px;">ModelFit</h1>
        <p style="margin: 0; color: #6b7280;">가장 적합한 AI 모델을 찾는 중입니다...</p>
      </main>
    `;
  }

  return target;
}

export function sendPreparedWindowToModel(
  target: Window | null,
  modelId: string
): boolean {
  const url = getModelWebUrl(modelId);

  if (!target || !url) {
    target?.close();
    return false;
  }

  target.opener = null;
  target.location.replace(url);
  return true;
}
