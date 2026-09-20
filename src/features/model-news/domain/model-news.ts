export type ModelNewsProvider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "Meta"
  | "Mistral"
  | "DeepSeek"
  | "Other";

export type ModelNewsCategory =
  | "model_release"
  | "model_update"
  | "pricing"
  | "capability"
  | "availability";

export interface ModelNewsSection {
  heading: string;
  paragraphs: string[];
}

export interface ModelNewsItem {
  id: string;
  provider: ModelNewsProvider;
  category: ModelNewsCategory;
  title: string;
  subtitle: string;
  publishedAt: string;
  modelNames: string[];
  summary: string;
  changes: string[];
  recommendedFor: string[];
  tags: string[];
  sections: ModelNewsSection[];
  sourceUrl: string;
  featured?: boolean;
}

export const MODEL_NEWS_ITEMS: ModelNewsItem[] = [
  {
    id: "openai-gpt-6-astra-2026-09-03",
    provider: "OpenAI",
    category: "model_release",
    title: "GPT-6 Astra 등장, 복잡한 실무와 에이전트 작업을 더 깊게",
    subtitle:
      "코딩·리서치·컴퓨터 사용·복잡한 다단계 작업을 중심으로 강화된 OpenAI의 신규 모델",
    publishedAt: "2026-09-03",
    modelNames: ["GPT-6 Astra"],
    summary:
      "OpenAI가 GPT-6 Astra를 공개했습니다. 복잡한 코딩과 리서치뿐 아니라 컴퓨터 사용, 긴 작업 흐름을 이어가는 에이전트형 업무에 초점을 둔 모델입니다.",
    changes: [
      "코딩·리서치·컴퓨터 사용 및 복잡한 다단계 작업 성능 강화",
      "문서·스프레드시트·프레젠테이션 등 실제 업무 산출물 작업 지원 강화",
      "초기에는 제한된 조직부터 순차 제공",
    ],
    recommendedFor: [
      "여러 단계를 스스로 이어가야 하는 복잡한 업무",
      "고난도 코딩·리서치",
      "결과물 완성도와 작업 지속성이 중요한 사용자",
    ],
    tags: [
      "#GPT6Astra",
      "#고난도코딩",
      "#리서치",
      "#에이전트",
      "#컴퓨터사용",
      "#복잡한작업",
    ],
    sections: [
      {
        heading: "이번 업데이트의 핵심",
        paragraphs: [
          "GPT-6 Astra는 짧은 질답보다 여러 단계를 이어서 처리해야 하는 실무형 작업에 초점을 둔 업데이트입니다. 단순히 한 번의 답을 잘 만드는 것보다, 작업 맥락을 유지하고 다음 행동까지 연결하는 흐름이 중요해졌습니다.",
          "특히 코딩, 리서치, 컴퓨터 사용처럼 도구를 오가며 결과물을 완성해야 하는 작업에서 활용도가 높습니다.",
        ],
      },
      {
        heading: "ModelFit에서는 이렇게 볼 수 있어요",
        paragraphs: [
          "속도나 비용보다 품질과 복잡한 작업 처리 능력을 우선하는 사용자에게 더 높은 우선순위를 줄 수 있습니다.",
          "간단한 요약이나 반복적인 짧은 요청에는 더 빠르고 가벼운 모델이 효율적일 수 있으므로, Astra가 항상 최선인 것은 아닙니다.",
        ],
      },
    ],
    sourceUrl: "https://openai.com/index/gpt-6-astra/",
    featured: true,
  },
  {
    id: "google-gemini-3-8-flash-2026-09-02",
    provider: "Google",
    category: "model_release",
    title: "Gemini 3.8 Flash, 빠른 속도 그대로 추론·코딩 성능을 끌어올리다",
    subtitle:
      "에이전트 워크플로우와 사이버보안까지 겨냥한 Google의 최신 Flash 계열",
    publishedAt: "2026-09-02",
    modelNames: ["Gemini 3.8 Flash", "Gemini 3.8 Flash Cyber"],
    summary:
      "Google은 Gemini 3.8 Flash를 3.7과 같은 속도·가격대의 차세대 주력 모델로 소개했습니다. 소프트웨어 엔지니어링, 에이전트 작업, 다단계 추론이 핵심 강화 영역입니다.",
    changes: [
      "Gemini 3.7 Flash 대비 소프트웨어 엔지니어링·에이전트 작업 강화",
      "빠른 응답과 비교적 낮은 비용을 유지하면서 추론 성능 향상",
      "사이버보안 특화 변형인 Gemini 3.8 Flash Cyber도 함께 공개",
    ],
    recommendedFor: [
      "빠른 응답과 높은 지능을 동시에 원하는 개발 작업",
      "에이전트·자동화 워크플로우",
      "비용과 성능 균형이 중요한 반복 호출",
    ],
    tags: [
      "#Gemini38Flash",
      "#빠른응답",
      "#코딩",
      "#에이전트",
      "#가성비",
      "#사이버보안",
    ],
    sections: [
      {
        heading: "Flash 계열의 포지션이 더 선명해졌어요",
        paragraphs: [
          "Flash 계열은 빠른 응답과 비용 효율이 중요한 제품 환경에서 자주 선택되는 모델입니다. 이번 업데이트는 그 장점을 유지하면서 코딩과 에이전트형 작업의 성능을 끌어올리는 방향에 가깝습니다.",
          "즉, 최고 성능 하나만 노리기보다 실제 서비스에서 반복 호출하기 좋은 균형형 모델로 볼 수 있습니다.",
        ],
      },
      {
        heading: "어떤 사용자에게 잘 맞을까",
        paragraphs: [
          "IDE 보조, 빠른 코드 리뷰, 반복적인 자동화처럼 대기 시간이 작업 흐름을 끊는 상황에서 특히 유리합니다.",
          "반대로 매우 복잡한 단일 문제에서 최고 품질이 필요한 경우에는 더 무거운 상위 모델과 비교해 선택하는 편이 좋습니다.",
        ],
      },
    ],
    sourceUrl:
      "https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/",
    featured: true,
  },
  {
    id: "anthropic-fable-mythos-5-1-2026-09-01",
    provider: "Anthropic",
    category: "model_release",
    title: "Claude Fable 5.1·Mythos 5.1 공개, 코딩과 전문 지식 작업에 집중",
    subtitle:
      "Anthropic의 최신 5.1 계열이 코딩·지식 업무와 과학 연구 역량을 강화",
    publishedAt: "2026-09-01",
    modelNames: ["Claude Fable 5.1", "Claude Mythos 5.1"],
    summary:
      "Anthropic은 Fable 5.1과 Mythos 5.1을 공개했습니다. Fable은 코딩과 지식 업무, Mythos는 사이버보안·생물학 등 전문 연구 영역에 초점을 둡니다.",
    changes: [
      "Fable 5.1의 코딩·지식 업무 성능 개선",
      "연구 작업에서 강화된 전문 역량 제공",
      "Mythos 5.1은 사이버보안·생물학 연구 중심이며 접근 범위가 제한적",
    ],
    recommendedFor: [
      "코딩과 문서·지식 업무를 함께 처리하는 사용자",
      "긴 맥락을 유지하는 전문 작업",
      "전문 연구 분야에서 높은 품질을 원하는 팀",
    ],
    tags: [
      "#ClaudeFable51",
      "#ClaudeMythos51",
      "#코딩",
      "#지식작업",
      "#연구",
      "#전문업무",
    ],
    sections: [
      {
        heading: "한 모델보다 역할 분화가 눈에 띄어요",
        paragraphs: [
          "이번 5.1 계열은 모든 사용자를 한 모델로 커버하기보다, 코딩·지식 업무와 전문 연구 영역을 나눠 강화하는 흐름이 뚜렷합니다.",
          "ModelFit 입장에서는 단순한 공급사 선호보다 실제 작업 종류를 먼저 보고 모델을 고르는 이유가 더 커진 셈입니다.",
        ],
      },
      {
        heading: "추천할 때 봐야 할 포인트",
        paragraphs: [
          "긴 문맥을 읽고 문서와 코드를 함께 다루는 작업에서는 Fable 계열을 우선 비교할 가치가 있습니다.",
          "전문 연구형 모델은 접근 범위와 비용, 실제 사용 가능 여부까지 함께 확인해야 하므로 일반 사용자 추천과는 분리하는 것이 좋습니다.",
        ],
      },
    ],
    sourceUrl: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
  },
  {
    id: "openai-chatgpt-images-2-5-2026-09-08",
    provider: "OpenAI",
    category: "capability",
    title: "ChatGPT Images 2.5 업데이트, 생성보다 ‘편집 흐름’이 더 좋아졌다",
    subtitle:
      "디테일·정밀 편집·생성 속도 개선과 템플릿·스케치 기반 생성 기능 추가",
    publishedAt: "2026-09-08",
    modelNames: ["ChatGPT Images 2.5"],
    summary:
      "이미지 생성 자체뿐 아니라 기존 결과를 고치고 반복 편집하는 흐름이 강화됐습니다. 템플릿과 모바일 스케치 기반 생성처럼 진입 방식도 다양해졌습니다.",
    changes: [
      "더 선명한 디테일과 정밀한 이미지 편집",
      "이미지 생성 속도 개선",
      "템플릿 및 모바일 스케치 기반 생성·공유 기능 추가",
    ],
    recommendedFor: [
      "이미지를 반복 수정해야 하는 디자인 작업",
      "간단한 스케치에서 시안을 빠르게 만드는 작업",
      "프롬프트를 공유·재사용하는 콘텐츠 제작",
    ],
    tags: [
      "#ChatGPTImages25",
      "#이미지생성",
      "#이미지편집",
      "#디자인",
      "#콘텐츠제작",
    ],
    sections: [
      {
        heading: "생성보다 수정 과정이 중요해졌어요",
        paragraphs: [
          "이미지 AI를 실제 업무에서 쓰면 첫 생성보다 이후 수정 횟수가 더 많아지는 경우가 흔합니다. 이번 업데이트는 이 반복 편집 경험을 줄이는 쪽에 초점이 맞춰져 있습니다.",
          "처음부터 완벽한 프롬프트를 작성하지 않아도 결과를 보며 조금씩 수정하는 흐름이 자연스러워졌다는 점이 핵심입니다.",
        ],
      },
      {
        heading: "ModelFit 추천에서는 별도 축이 필요해요",
        paragraphs: [
          "이미지 생성은 일반 텍스트 모델과 평가 기준이 다릅니다. 텍스트 추론 성능보다 편집 일관성, 디테일 유지, 생성 속도 같은 요소를 따로 봐야 합니다.",
          "향후 ModelFit에서 이미지 작업을 감지하면 텍스트 모델 랭킹과 분리된 이미지 모델 추천으로 연결하는 것이 적합합니다.",
        ],
      },
    ],
    sourceUrl: "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
  },
];

export const NEWS_PROVIDER_FILTERS = [
  "전체",
  "OpenAI",
  "Anthropic",
  "Google",
] as const;

export const NEWS_TAG_FILTERS = [
  "전체",
  "#코딩",
  "#리서치",
  "#에이전트",
  "#빠른응답",
  "#이미지생성",
] as const;

export function getModelNewsItem(id: string) {
  return MODEL_NEWS_ITEMS.find((item) => item.id === id);
}
