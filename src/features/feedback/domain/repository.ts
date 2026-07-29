import type { FeedbackRequest } from "@/src/shared/validation/api.schema";

export interface FeedbackRepository {
  save(feedback: FeedbackRequest): Promise<string>;
}
