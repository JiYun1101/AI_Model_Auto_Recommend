import { describe, it, expect } from "vitest";
import { RuleBasedPromptAnalyzer } from "@/src/features/prompt-analysis/application/rule-based-analyzer";

const analyzer = new RuleBasedPromptAnalyzer();

describe("RuleBasedPromptAnalyzer", () => {
  describe("작업 유형 분류", () => {
    it("일반 질문을 general로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "오늘 날씨가 어떤가요?",
      });
      expect(result.taskType).toBe("general");
    });

    it("글쓰기 요청을 writing으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "자기소개서를 한 페이지 분량으로 작성해줘",
      });
      expect(result.taskType).toBe("writing");
    });

    it("번역 요청을 translation으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "이 문장을 영어로 번역해줘: 안녕하세요",
      });
      expect(result.taskType).toBe("translation");
    });

    it("요약 요청을 summarization으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "다음 긴 글을 3줄로 요약해줘",
      });
      expect(result.taskType).toBe("summarization");
    });

    it("코딩 요청을 coding으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "Python으로 피보나치 수열을 구하는 함수를 구현해줘",
      });
      expect(result.taskType).toBe("coding");
    });

    it("코드 블록이 있으면 coding으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "다음 코드를 설명해줘:\n```python\ndef hello():\n    print('hello')\n```",
      });
      expect(result.taskType).toBe("coding");
    });

    it("디버깅 요청을 debugging으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "이 코드에서 에러가 발생하는데 원인을 찾아줘",
      });
      expect(result.taskType).toBe("debugging");
    });

    it("복합 분석 요청을 reasoning으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "두 가지 접근 방식을 비교 분석하고 평가해줘. 장단점도 함께 설명해줘.",
      });
      expect(result.taskType).toBe("reasoning");
    });

    it("구조화 출력 요청을 data_extraction으로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt: "다음 데이터를 JSON 형식으로 변환해줘",
      });
      expect(result.taskType).toBe("data_extraction");
    });
  });

  describe("복잡도 분류", () => {
    it("짧은 질문을 simple로 분류한다", async () => {
      const result = await analyzer.analyze({ prompt: "안녕" });
      expect(result.complexity).toBe("simple");
    });

    it("복잡한 다단계 요청을 complex로 분류한다", async () => {
      const result = await analyzer.analyze({
        prompt:
          "먼저 현재 시스템 분석을 하고, 그 다음으로 개선 방안을 3가지 제시한 뒤, 마지막으로 각 방안의 비용과 효과를 비교하는 보고서를 작성해줘. 또한 구현 일정도 포함해야 하고, 리스크 분석도 필요합니다.",
      });
      expect(result.complexity).toBe("complex");
    });
  });

  describe("필요 기능 추출", () => {
    it("이미지 언급 시 vision 기능을 추출한다", async () => {
      const result = await analyzer.analyze({
        prompt: "이 이미지를 분석해줘",
      });
      expect(result.requiredCapabilities).toContain("vision");
    });

    it("JSON 요청 시 structured_output 기능을 추출한다", async () => {
      const result = await analyzer.analyze({
        prompt: "결과를 JSON 형식으로 출력해줘",
      });
      expect(result.requiredCapabilities).toContain("structured_output");
    });

    it("한국어 입력 시 multilingual 기능을 추출한다", async () => {
      const result = await analyzer.analyze({
        prompt: "이것을 설명해줘",
      });
      expect(result.requiredCapabilities).toContain("multilingual");
    });

    it("코딩 작업 시 coding 기능을 추출한다", async () => {
      const result = await analyzer.analyze({
        prompt: "Python 함수를 구현해줘",
      });
      expect(result.requiredCapabilities).toContain("coding");
    });
  });

  describe("언어 감지", () => {
    it("한국어 입력을 ko로 감지한다", async () => {
      const result = await analyzer.analyze({ prompt: "안녕하세요 반갑습니다" });
      expect(result.inputLanguage).toBe("ko");
    });

    it("영어 입력을 en으로 감지한다", async () => {
      const result = await analyzer.analyze({
        prompt: "How do I create a REST API?",
      });
      expect(result.inputLanguage).toBe("en");
    });
  });

  describe("신뢰도", () => {
    it("신뢰도가 0~1 범위 내에 있다", async () => {
      const result = await analyzer.analyze({ prompt: "코드를 작성해줘" });
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe("긴 프롬프트", () => {
    it("긴 프롬프트에서 long_context 기능을 추출한다", async () => {
      const longPrompt = "질문: " + "내용이 매우 깁니다. ".repeat(300);
      const result = await analyzer.analyze({ prompt: longPrompt });
      expect(result.requiredCapabilities).toContain("long_context");
    });
  });
});
