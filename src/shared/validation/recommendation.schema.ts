import { z } from "zod";

export const RecommendationTypeSchema = z.enum([
  "best",
  "free_alternative",
  "fast_economy",
]);

export const ModelAccessSchema = z.object({
  webAvailable: z.boolean(),
  apiAvailable: z.boolean(),
  localAvailable: z.boolean(),
  freeAvailable: z.boolean(),
});

export const ModelRecommendationSchema = z.object({
  modelId: z.string(),
  rank: z.number().int().min(1),

  recommendationType: RecommendationTypeSchema,

  score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),

  reasons: z.array(z.string()),
  limitations: z.array(z.string()),

  access: ModelAccessSchema,
});

export const RecommendationMetadataSchema = z.object({
  catalogVersion: z.string(),
  evaluatedModelCount: z.number().int().nonnegative(),
  eligibleModelCount: z.number().int().nonnegative(),
});

export type ModelRecommendation = z.infer<typeof ModelRecommendationSchema>;
export type RecommendationType = z.infer<typeof RecommendationTypeSchema>;
export type ModelAccess = z.infer<typeof ModelAccessSchema>;
export type RecommendationMetadata = z.infer<
  typeof RecommendationMetadataSchema
>;
