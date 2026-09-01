/**
 * Asynchronous Event Queue Architecture (RabbitMQ / Event-Driven Queue pattern)
 * Decouples synchronous HTTP requests from background processing (LLM evaluation, notifications).
 */

export interface QueueJob<T = any> {
  id: string;
  topic: "interview.completed" | "email.notification" | "ai.evaluation";
  payload: T;
  createdAt: number;
}

type JobHandler<T = any> = (job: QueueJob<T>) => Promise<void>;

const handlers = new Map<string, JobHandler[]>();

export class EventQueue {
  /**
   * Subscribe worker handler to an event topic
   */
  static subscribe<T = any>(
    topic: QueueJob["topic"],
    handler: JobHandler<T>
  ): void {
    const existing = handlers.get(topic) || [];
    existing.push(handler as JobHandler);
    handlers.set(topic, existing);
  }

  /**
   * Publish job to event queue
   */
  static async publish<T = any>(
    topic: QueueJob["topic"],
    payload: T
  ): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      topic,
      payload,
      createdAt: Date.now(),
    };

    // Asynchronously dispatch to worker subscribers without blocking the caller thread
    setTimeout(async () => {
      const topicHandlers = handlers.get(topic) || [];
      for (const handler of topicHandlers) {
        try {
          await handler(job);
        } catch (err) {
          console.error(`[EventQueue Worker Error] Topic: ${topic}, JobId: ${job.id}`, err);
        }
      }
    }, 10);

    return job;
  }
}
