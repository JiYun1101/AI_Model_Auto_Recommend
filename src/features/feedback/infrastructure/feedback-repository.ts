import type { FeedbackRepository } from "../domain/repository";
import type { FeedbackRequest } from "@/src/shared/validation/api.schema";

/** Phase 1: 메모리 저장. Phase 2에서 DB 구현체로 교체 */
class InMemoryFeedbackRepository implements FeedbackRepository {
  private store: Array<FeedbackRequest & { id: string; createdAt: string }> = [];

  async save(feedback: FeedbackRequest): Promise<string> {
    const id = `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.store.push({ ...feedback, id, createdAt: new Date().toISOString() });
    return id;
  }
}

let instance: FeedbackRepository | null = null;

export function getFeedbackRepository(): FeedbackRepository {
  if (!instance) {
    instance = new InMemoryFeedbackRepository();
  }
  return instance;
}
