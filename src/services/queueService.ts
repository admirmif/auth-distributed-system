import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

class QueueService {
  private queues: Record<string, Queue> = {};
  private workers: Record<string, Worker> = {};
  private queueEvents: Record<string, QueueEvents> = {};

  constructor(
    private readonly connection: IORedis,
    private readonly logger: any
  ) {}

  async addJob(queueName: string, jobData: any) {
    if (!this.queues[queueName]) {
      this.queues[queueName] = new Queue(queueName, { connection: this.connection });
    }

    return this.queues[queueName].add(queueName, jobData);
  }

  startWorker(queueName: string, processor: (job: any) => Promise<void>) {
    if (this.workers[queueName]) return;

    this.workers[queueName] = new Worker(queueName, processor, {
      connection: this.connection,
    });

    this.queueEvents[queueName] = new QueueEvents(queueName, {
      connection: this.connection,
    });

    this.setupEventListeners(queueName);
  }

  private setupEventListeners(queueName: string) {
    const worker = this.workers[queueName];
    const queueEvents = this.queueEvents[queueName];

    worker.on('completed', (job) => {
      this.logger.info(`Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });

    queueEvents.on('progress', ({ jobId, data }) => {
      this.logger.info(`Job ${jobId} progress: ${data}`);
    });
  }
}

export default QueueService;