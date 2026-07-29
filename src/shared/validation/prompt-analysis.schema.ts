import { z } from "zod";

export const TaskTypeSchema = z.enum([
  "general",
  "coding",
  "debugging",
  "reasoning",
  "writing",
  "translation",
  "summarization",
  "research",
  "data_extraction",
  "planning",
]);

export const ComplexitySchema = z.enum(["simple", "standard", "complex"]);

export const OutputLengthSchema = z.enum(["short", "medium", "long"]);

export const RequiredCapabilitySchema = z.enum([
  "long_context",
  "vision",
  "tool_calling",
  "structured_output",
  "reasoning",
  "coding",
  "multilingual",
]);

export const PrioritiesSchema = z.object({
  quality: z.number().min(0).max(1),
  cost: z.number().min(0).max(1),
  speed: z.number().min(0).max(1),
});

export const PromptAnalysisSchema = z.object({
  taskType: TaskTypeSchema,
  complexity: ComplexitySchema,
  inputLanguage: z.string(),

  estimatedInputTokens: z.number().nonnegative(),
  estimatedOutputLength: OutputLengthSchema,

  requiredCapabilities: z.array(RequiredCapabilitySchema),

  priorities: PrioritiesSchema,

  confidence: z.number().min(0).max(1),
  reasons: z.array(z.string()),
});

export type PromptAnalysis = z.infer<typeof PromptAnalysisSchema>;
export type TaskType = z.infer<typeof TaskTypeSchema>;
export type Complexity = z.infer<typeof ComplexitySchema>;
export type RequiredCapability = z.infer<typeof RequiredCapabilitySchema>;
export type Priorities = z.infer<typeof PrioritiesSchema>;
