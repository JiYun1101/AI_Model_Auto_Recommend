import { z } from "zod";

export const AccessTypeSchema = z.enum(["web", "api", "open-weight", "local"]);

export const InputModalitySchema = z.enum([
  "text",
  "image",
  "audio",
  "video",
  "file",
]);

export const OutputModalitySchema = z.enum(["text", "image", "audio", "video"]);

export const ModelStatusSchema = z.enum([
  "active",
  "preview",
  "deprecated",
  "unavailable",
]);

export const TaskScoresSchema = z.object({
  general: z.number().min(0).max(100),
  coding: z.number().min(0).max(100),
  reasoning: z.number().min(0).max(100),
  writing: z.number().min(0).max(100),
  translation: z.number().min(0).max(100),
  summarization: z.number().min(0).max(100),
  longContext: z.number().min(0).max(100),
});

export const ModelProfileSchema = z.object({
  id: z.string().min(1),
  provider: z.string().min(1),
  displayName: z.string().min(1),
  family: z.string().min(1),

  accessType: z.array(AccessTypeSchema).min(1),

  isOpenWeight: z.boolean(),
  isFreeExecutable: z.boolean(),
  freeExecutionProvider: z.string().optional(),

  inputModalities: z.array(InputModalitySchema).min(1),
  outputModalities: z.array(OutputModalitySchema).min(1),

  contextWindow: z.number().positive().optional(),
  maxOutputTokens: z.number().positive().optional(),

  supportsReasoning: z.boolean(),
  supportsToolCalling: z.boolean(),
  supportsStructuredOutput: z.boolean(),
  supportsWebSearch: z.boolean(),

  taskScores: TaskScoresSchema,

  qualityTier: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  speedTier: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  costTier: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  stabilityTier: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),

  strengths: z.array(z.string()),
  limitations: z.array(z.string()),

  status: ModelStatusSchema,

  sourceUpdatedAt: z.string().datetime({ offset: true }).optional(),
  lastVerifiedAt: z.string().datetime({ offset: true }),
});

export type ModelProfile = z.infer<typeof ModelProfileSchema>;
export type TaskScores = z.infer<typeof TaskScoresSchema>;
export type ModelStatus = z.infer<typeof ModelStatusSchema>;
export type AccessType = z.infer<typeof AccessTypeSchema>;
export type InputModality = z.infer<typeof InputModalitySchema>;
export type OutputModality = z.infer<typeof OutputModalitySchema>;
