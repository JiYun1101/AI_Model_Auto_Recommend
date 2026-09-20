import type { Priorities } from "@/src/shared/validation/prompt-analysis.schema";

export type AiTypeId =
  | "precision_architect"
  | "rapid_explorer"
  | "efficient_builder"
  | "balanced_orchestrator";

export interface AiTypeProfile {
  id: AiTypeId;
  title: string;
  emoji: string;
  summary: string;
  description: string;
  priorities: Priorities;
  traits: string[];
}

export interface AiTypeAnswer {
  quality: number;
  cost: number;
  speed: number;
}

export interface AiTypeQuestion {
  id: string;
  question: string;
  options: [
    { label: string; score: AiTypeAnswer },
    { label: string; score: AiTypeAnswer }
  ];
}

export const AI_TYPE_QUESTIONS: AiTypeQuestion[] = [
  {
    id: "first-response",
    question: "AI 답변을 받을 때 더 중요한 건?",
    options: [
      {
        label: "조금 늦어도 최대한 정확하고 완성도 높은 답변",
        score: { quality: 3, cost: 0, speed: 0 },
      },
      {
        label: "일단 빠르게 답을 받고 필요하면 다시 수정",
        score: { quality: 0, cost: 0, speed: 3 },
      },
    ],
  },
  {
    id: "paid-model",
    question: "유료 모델이 더 좋다고 추천되면?",
    options: [
      {
        label: "결과 차이가 확실하면 비용을 내도 괜찮다",
        score: { quality: 2, cost: 0, speed: 0 },
      },
      {
        label: "비슷하면 무료·저렴한 모델부터 써본다",
        score: { quality: 0, cost: 3, speed: 0 },
      },
    ],
  },
  {
    id: "long-task",
    question: "복잡한 작업을 맡길 때 나는?",
    options: [
      {
        label: "한 번에 깊게 분석해서 최종 결과를 받고 싶다",
        score: { quality: 3, cost: 0, speed: 0 },
      },
      {
        label: "짧게 여러 번 주고받으며 빠르게 방향을 잡는다",
        score: { quality: 0, cost: 0, speed: 3 },
      },
    ],
  },
  {
    id: "model-choice",
    question: "새로운 AI 모델이 나오면?",
    options: [
      {
        label: "성능이 좋다는 근거가 있으면 바로 써본다",
        score: { quality: 2, cost: 0, speed: 1 },
      },
      {
        label: "검증되고 효율적인 모델인지 먼저 본다",
        score: { quality: 0, cost: 2, speed: 1 },
      },
    ],
  },
  {
    id: "routine-task",
    question: "반복적인 간단한 업무라면?",
    options: [
      {
        label: "간단한 일도 결과 품질이 일정해야 한다",
        score: { quality: 2, cost: 1, speed: 0 },
      },
      {
        label: "조금 덜 완벽해도 빠르고 저렴하면 충분하다",
        score: { quality: 0, cost: 2, speed: 2 },
      },
    ],
  },
  {
    id: "default-model",
    question: "내 기본 AI 하나를 고른다면?",
    options: [
      {
        label: "대부분의 일을 잘하는 강력한 주력 모델",
        score: { quality: 3, cost: 0, speed: 0 },
      },
      {
        label: "부담 없이 자주 호출할 수 있는 실용 모델",
        score: { quality: 0, cost: 2, speed: 2 },
      },
    ],
  },
];

export const AI_TYPE_PROFILES: Record<AiTypeId, AiTypeProfile> = {
  precision_architect: {
    id: "precision_architect",
    title: "완벽주의 설계자",
    emoji: "🎯",
    summary: "속도나 비용보다 결과의 완성도와 정확도를 우선해요.",
    description:
      "복잡한 코딩, 분석, 글쓰기처럼 한 번의 답변 품질이 중요한 작업에서 상위 모델의 가치를 크게 느끼는 유형입니다.",
    priorities: { quality: 0.9, cost: 0.25, speed: 0.35 },
    traits: ["정확성 우선", "복잡한 작업 선호", "상위 모델 투자 의향"],
  },
  rapid_explorer: {
    id: "rapid_explorer",
    title: "속전속결 탐험가",
    emoji: "⚡",
    summary: "빠르게 답을 받고 여러 번 개선하는 흐름을 선호해요.",
    description:
      "아이디어 탐색, 짧은 질답, 빠른 프로토타이핑처럼 응답 속도가 작업 리듬에 직접 영향을 주는 경우에 강합니다.",
    priorities: { quality: 0.55, cost: 0.4, speed: 0.95 },
    traits: ["응답 속도 우선", "반복 개선 선호", "빠른 실험"],
  },
  efficient_builder: {
    id: "efficient_builder",
    title: "가성비 최적화러",
    emoji: "🛠️",
    summary: "필요한 품질을 유지하면서 비용 효율을 가장 꼼꼼히 봐요.",
    description:
      "무료·저비용 모델과 로컬 모델을 적극 활용하면서, 꼭 필요한 순간에만 상위 모델을 선택하는 실용적인 유형입니다.",
    priorities: { quality: 0.6, cost: 0.95, speed: 0.65 },
    traits: ["비용 효율 우선", "무료 모델 활용", "실용적 선택"],
  },
  balanced_orchestrator: {
    id: "balanced_orchestrator",
    title: "밸런스 조율자",
    emoji: "🧭",
    summary: "품질·비용·속도를 상황에 따라 고르게 조절해요.",
    description:
      "특정 기준 하나보다 작업 목적에 맞춰 모델을 바꾸는 편이라 ModelFit의 상황별 라우팅과 가장 잘 맞는 유형입니다.",
    priorities: { quality: 0.7, cost: 0.65, speed: 0.65 },
    traits: ["상황별 선택", "균형 중시", "모델 전환에 유연"],
  },
};

export function calculateAiType(answers: AiTypeAnswer[]): AiTypeProfile {
  const totals = answers.reduce(
    (acc, answer) => ({
      quality: acc.quality + answer.quality,
      cost: acc.cost + answer.cost,
      speed: acc.speed + answer.speed,
    }),
    { quality: 0, cost: 0, speed: 0 }
  );

  const values = Object.values(totals);
  const spread = Math.max(...values) - Math.min(...values);

  if (spread <= 3) {
    return AI_TYPE_PROFILES.balanced_orchestrator;
  }

  if (totals.quality >= totals.cost && totals.quality >= totals.speed) {
    return AI_TYPE_PROFILES.precision_architect;
  }

  if (totals.speed >= totals.cost) {
    return AI_TYPE_PROFILES.rapid_explorer;
  }

  return AI_TYPE_PROFILES.efficient_builder;
}
