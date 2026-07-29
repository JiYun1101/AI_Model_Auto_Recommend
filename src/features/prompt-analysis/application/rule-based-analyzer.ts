import type { PromptAnalyzer, PromptAnalyzerInput } from "../domain/analyzer";
import type {
  PromptAnalysis,
  TaskType,
  Complexity,
  RequiredCapability,
} from "@/src/shared/validation/prompt-analysis.schema";

// ── 키워드 사전 ───────────────────────────────────────────────

const CODING_KEYWORDS = [
  "코드",
  "함수",
  "클래스",
  "알고리즘",
  "구현",
  "프로그램",
  "스크립트",
  "API",
  "데이터베이스",
  "SQL",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "code",
  "function",
  "class",
  "implement",
  "programming",
  "script",
  "database",
];

const DEBUGGING_KEYWORDS = [
  "오류",
  "에러",
  "버그",
  "디버그",
  "수정",
  "고쳐",
  "안 돼",
  "안됩니다",
  "문제",
  "실패",
  "에러가",
  "error",
  "bug",
  "fix",
  "debug",
  "broken",
  "issue",
  "doesn't work",
  "not working",
  "failed",
  "exception",
  "traceback",
];

const WRITING_KEYWORDS = [
  "작성",
  "써줘",
  "써주세요",
  "글쓰기",
  "이메일",
  "보고서",
  "에세이",
  "소개글",
  "자기소개서",
  "블로그",
  "카피",
  "문구",
  "write",
  "draft",
  "compose",
  "email",
  "essay",
  "report",
  "blog",
  "copywriting",
];

const TRANSLATION_KEYWORDS = [
  "번역",
  "translate",
  "translation",
  "영어로",
  "한국어로",
  "일본어로",
  "중국어로",
  "to English",
  "to Korean",
  "to Japanese",
];

const SUMMARIZATION_KEYWORDS = [
  "요약",
  "정리",
  "핵심만",
  "줄여",
  "summary",
  "summarize",
  "summarize",
  "tldr",
  "TL;DR",
  "brief",
];

const REASONING_KEYWORDS = [
  "분석",
  "비교",
  "판단",
  "평가",
  "검토",
  "왜",
  "이유",
  "원인",
  "어떻게 생각",
  "pros and cons",
  "analyze",
  "compare",
  "evaluate",
  "assess",
  "reason",
  "explain why",
];

const PLANNING_KEYWORDS = [
  "계획",
  "로드맵",
  "일정",
  "순서",
  "단계",
  "전략",
  "plan",
  "roadmap",
  "schedule",
  "strategy",
  "steps",
  "outline",
];

const RESEARCH_KEYWORDS = [
  "조사",
  "찾아",
  "알려줘",
  "설명해줘",
  "research",
  "find out",
  "look up",
  "what is",
  "how does",
  "who is",
];

const STRUCTURED_OUTPUT_KEYWORDS = [
  "JSON",
  "표로",
  "테이블",
  "목록으로",
  "list",
  "table",
  "structured",
  "format",
  "schema",
  "XML",
  "CSV",
];

const VISION_KEYWORDS = [
  "이미지",
  "사진",
  "그림",
  "스크린샷",
  "PDF",
  "첨부",
  "image",
  "photo",
  "picture",
  "screenshot",
  "pdf",
  "attachment",
  "file",
];

// ── 토큰 추정 ────────────────────────────────────────────────

function estimateTokens(text: string): number {
  // 영어 기준 약 4자/토큰, 한국어는 약 2자/토큰으로 보수적 추정
  const koreanChars = (text.match(/[가-힣]/g) ?? []).length;
  const otherChars = text.length - koreanChars;
  return Math.ceil(koreanChars / 2 + otherChars / 4);
}

// ── 언어 감지 ────────────────────────────────────────────────

function detectLanguage(text: string): string {
  const koreanRatio =
    (text.match(/[가-힣]/g) ?? []).length / (text.length || 1);
  if (koreanRatio > 0.1) return "ko";
  return "en";
}

// ── 키워드 매칭 ──────────────────────────────────────────────

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw.toLowerCase())).length;
}

// ── 작업 유형 감지 ───────────────────────────────────────────

function detectTaskType(prompt: string): {
  taskType: TaskType;
  confidence: number;
  reasons: string[];
} {
  const reasons: string[] = [];

  const hasCode =
    /```[\s\S]*?```/.test(prompt) || /`[^`]+`/.test(prompt);
  const debugScore = countMatches(prompt, DEBUGGING_KEYWORDS);
  const codingScore = countMatches(prompt, CODING_KEYWORDS);
  const writingScore = countMatches(prompt, WRITING_KEYWORDS);
  const translationScore = countMatches(prompt, TRANSLATION_KEYWORDS);
  const summarizationScore = countMatches(prompt, SUMMARIZATION_KEYWORDS);
  const reasoningScore = countMatches(prompt, REASONING_KEYWORDS);
  const planningScore = countMatches(prompt, PLANNING_KEYWORDS);
  const researchScore = countMatches(prompt, RESEARCH_KEYWORDS);
  const structuredScore = countMatches(prompt, STRUCTURED_OUTPUT_KEYWORDS);

  if (debugScore >= 1) {
    reasons.push("오류·버그·수정 관련 키워드가 감지되었습니다.");
    return { taskType: "debugging", confidence: Math.min(0.6 + debugScore * 0.1, 0.95), reasons };
  }

  if (translationScore >= 1) {
    reasons.push("번역 요청이 감지되었습니다.");
    return { taskType: "translation", confidence: Math.min(0.7 + translationScore * 0.1, 0.95), reasons };
  }

  if (summarizationScore >= 1) {
    reasons.push("요약·정리 요청이 감지되었습니다.");
    return { taskType: "summarization", confidence: Math.min(0.7 + summarizationScore * 0.1, 0.95), reasons };
  }

  if ((hasCode || codingScore >= 1) && debugScore === 0) {
    reasons.push("코드 블록 또는 프로그래밍 관련 키워드가 있습니다.");
    return { taskType: "coding", confidence: Math.min(0.6 + codingScore * 0.1, 0.95), reasons };
  }

  if (writingScore >= 2) {
    reasons.push("글쓰기·문서 작성 요청이 감지되었습니다.");
    return { taskType: "writing", confidence: Math.min(0.6 + writingScore * 0.08, 0.9), reasons };
  }

  if (planningScore >= 1) {
    reasons.push("계획·전략·로드맵 관련 키워드가 있습니다.");
    return { taskType: "planning", confidence: Math.min(0.6 + planningScore * 0.1, 0.9), reasons };
  }

  if (structuredScore >= 1) {
    reasons.push("JSON, 표, 목록 등 구조화 출력 요청이 감지되었습니다.");
    return { taskType: "data_extraction", confidence: 0.75, reasons };
  }

  if (reasoningScore >= 2) {
    reasons.push("분석·비교·평가 관련 키워드가 여러 개 발견되었습니다.");
    return { taskType: "reasoning", confidence: Math.min(0.6 + reasoningScore * 0.07, 0.9), reasons };
  }

  if (researchScore >= 1) {
    reasons.push("정보 조사·질문 패턴이 감지되었습니다.");
    return { taskType: "research", confidence: 0.65, reasons };
  }

  reasons.push("특정 작업 유형을 명확히 구분하기 어려워 일반 질문으로 분류합니다.");
  return { taskType: "general", confidence: 0.5, reasons };
}

// ── 복잡도 분석 ─────────────────────────────────────────────

function detectComplexity(
  prompt: string,
  tokens: number
): { complexity: Complexity; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  if (tokens > 500) { score += 2; reasons.push("입력 길이가 깁니다."); }
  else if (tokens > 200) { score += 1; }

  const requirementCount = (prompt.match(/[;,]\s|그리고|또한|추가로|also|and|additionally/gi) ?? []).length;
  if (requirementCount >= 4) { score += 2; reasons.push("요구 조건이 많습니다."); }
  else if (requirementCount >= 2) { score += 1; }

  const multiStep = /(\d+\.|step|단계|먼저|그 다음|마지막으로|first|then|finally)/gi;
  if ((prompt.match(multiStep) ?? []).length >= 3) {
    score += 2;
    reasons.push("복합 단계 수행이 필요합니다.");
  }

  if (score >= 4) return { complexity: "complex", reasons };
  if (score >= 2) return { complexity: "standard", reasons };
  return { complexity: "simple", reasons };
}

// ── 필요 기능 추출 ──────────────────────────────────────────

function detectRequiredCapabilities(
  prompt: string,
  taskType: TaskType,
  tokens: number
): RequiredCapability[] {
  const caps = new Set<RequiredCapability>();

  if (containsAny(prompt, VISION_KEYWORDS)) caps.add("vision");
  if (containsAny(prompt, STRUCTURED_OUTPUT_KEYWORDS)) caps.add("structured_output");
  if (tokens > 1000) caps.add("long_context");
  if (taskType === "coding" || taskType === "debugging") caps.add("coding");
  if (taskType === "reasoning" || taskType === "research" || taskType === "planning")
    caps.add("reasoning");
  if (taskType === "translation" || detectLanguage(prompt) !== "en")
    caps.add("multilingual");

  return Array.from(caps);
}

// ── 출력 길이 추정 ──────────────────────────────────────────

function estimateOutputLength(
  taskType: TaskType,
  complexity: Complexity
): "short" | "medium" | "long" {
  const longTasks: TaskType[] = ["writing", "coding", "planning", "research"];
  const shortTasks: TaskType[] = ["translation", "summarization", "data_extraction"];

  if (longTasks.includes(taskType) && complexity === "complex") return "long";
  if (shortTasks.includes(taskType) && complexity === "simple") return "short";
  if (complexity === "complex") return "long";
  if (complexity === "simple") return "short";
  return "medium";
}

// ── 우선순위 기본값 ─────────────────────────────────────────

function defaultPriorities(): { quality: number; cost: number; speed: number } {
  return { quality: 0.5, cost: 0.3, speed: 0.2 };
}

// ── 메인 분석기 ─────────────────────────────────────────────

export class RuleBasedPromptAnalyzer implements PromptAnalyzer {
  async analyze(input: PromptAnalyzerInput): Promise<PromptAnalysis> {
    const { prompt } = input;
    const tokens = estimateTokens(prompt);
    const language = detectLanguage(prompt);

    const { taskType, confidence: taskConfidence, reasons: taskReasons } =
      detectTaskType(prompt);
    const { complexity, reasons: complexityReasons } = detectComplexity(prompt, tokens);
    const requiredCapabilities = detectRequiredCapabilities(prompt, taskType, tokens);
    const estimatedOutputLength = estimateOutputLength(taskType, complexity);

    const reasons = [...taskReasons, ...complexityReasons];

    // 다국어 능력이 필요한 경우 이유 추가
    if (requiredCapabilities.includes("multilingual") && language === "ko") {
      reasons.push("한국어 입력이 감지되었습니다.");
    }
    if (requiredCapabilities.includes("vision")) {
      reasons.push("이미지/파일 입력 관련 키워드가 감지되었습니다.");
    }
    if (requiredCapabilities.includes("long_context")) {
      reasons.push("입력 토큰이 많아 긴 컨텍스트 지원이 필요합니다.");
    }

    return {
      taskType,
      complexity,
      inputLanguage: language,
      estimatedInputTokens: tokens,
      estimatedOutputLength,
      requiredCapabilities,
      priorities: defaultPriorities(),
      confidence: taskConfidence,
      reasons,
    };
  }
}
