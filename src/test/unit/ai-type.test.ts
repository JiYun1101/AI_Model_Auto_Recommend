import { describe, expect, it } from "vitest";
import { calculateAiType } from "@/src/features/ai-profile/domain/ai-type";

describe("calculateAiType", () => {
  it("classifies a quality-first user as precision architect", () => {
    const result = calculateAiType([
      { quality: 3, cost: 0, speed: 0 },
      { quality: 3, cost: 0, speed: 0 },
      { quality: 3, cost: 0, speed: 0 },
    ]);

    expect(result.id).toBe("precision_architect");
    expect(result.priorities.quality).toBeGreaterThan(result.priorities.speed);
  });

  it("classifies a speed-first user as rapid explorer", () => {
    const result = calculateAiType([
      { quality: 0, cost: 0, speed: 3 },
      { quality: 0, cost: 1, speed: 3 },
      { quality: 0, cost: 0, speed: 3 },
    ]);

    expect(result.id).toBe("rapid_explorer");
  });

  it("classifies a cost-first user as efficient builder", () => {
    const result = calculateAiType([
      { quality: 0, cost: 3, speed: 0 },
      { quality: 0, cost: 3, speed: 0 },
      { quality: 1, cost: 3, speed: 0 },
    ]);

    expect(result.id).toBe("efficient_builder");
  });

  it("uses balanced orchestrator when preference scores are close", () => {
    const result = calculateAiType([
      { quality: 2, cost: 2, speed: 2 },
      { quality: 1, cost: 1, speed: 1 },
    ]);

    expect(result.id).toBe("balanced_orchestrator");
  });
});
