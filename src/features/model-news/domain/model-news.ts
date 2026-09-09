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
    sourceUrl: "https://www.anthropic.com/news",
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
    sourceUrl: "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
  },
];

export const NEWS_PROVIDER_FILTERS = [
  "전체",
  "OpenAI",
  "Anthropic",
  "Google",
] as const;
