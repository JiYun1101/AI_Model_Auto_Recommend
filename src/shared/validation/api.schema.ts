import { z } from "zod";
import {
  PromptAnalysisSchema,
  PrioritiesSchema,
} from "./prompt-analysis.schema";
import {
  ModelRecommendationSchema,
  RecommendationMetadataSchema,
} from "./recommendation.schema";

// POST /api/prompts/analyze
export const AnalyzeRequestSchema = z.object({
  prompt: z.string().min(1, "프롬프트를 입력해주세요.").max(50000),
  conversationId: z.string().optional(),
});

export const AnalyzeResponseSchema = z.object({
  analysis: PromptAnalysisSchema,
});

// POST /api/models/recommend
export const RecommendRequestSchema = z.object({
  prompt: z.string().min(1, "프롬프트를 입력해주세요.").max(50000),
  mode: z.enum(["all", "free_only"]).default("all"),
  priorities: PrioritiesSchema.optional(),
});

export const RecommendResponseSchema = z.object({
  analysis: PromptAnalysisSchema,
  recommendations: z.array(ModelRecommendationSchema),
  metadata: RecommendationMetadataSchema,
});

// GET /api/models
export const ModelsQuerySchema = z.object({
  provider: z.string().optional(),
  status: z.enum(["active", "preview", "deprecated", "unavailable"]).optional(),
  free: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  openWeight: z
    .string()
    .transform((v) => v === "true")
    .optional(),
});

// POST /api/feedback
export const FeedbackRequestSchema = z.object({
  recommendationId: z.string().optional(),
  modelId: z.string().min(1),
  result: z.enum(["helpful", "not_helpful"]),
  reason: z.string().max(500).optional(),
});

// Error response
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;
export type RecommendResponse = z.infer<typeof RecommendResponseSchema>;
export type ModelsQuery = z.infer<typeof ModelsQuerySchema>;
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
