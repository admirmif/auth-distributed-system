 interface WelcomeEmailJobData {
  email: string;
  name: string;
  userId: string;
}

class WelcomeEmailQueue {
  private queueName = 'welcome-email';
  private queueService: any;
  private emailService: any;

 constructor(queueService:any,emailService:any) {
    this.queueService = queueService
    this.emailService = emailService
    this.initialize();
  }
  private initialize() {
    console.log(`Initializing worker for queue: ${this.queueName}`);
    this.queueService.startWorker(
      this.queueName,
      async (job: { data: WelcomeEmailJobData }) => {
        await this.processJob(job.data);
      }
    );
  }

  async add(data: WelcomeEmailJobData) {
    return this.queueService.addJob(this.queueName, data);
  }

  private async processJob(data: WelcomeEmailJobData) {
    try {
      await this.emailService.sendWelcomeEmail(data.email, data.name);
    } catch (error:any) {
      throw new Error(`Failed to process welcome email: ${error.message}`);
    }
  }
}

export default WelcomeEmailQueue 