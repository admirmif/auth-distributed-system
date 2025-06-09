interface PasswordResetJobData {
  email: string;
  resetUrl: string;
  userId: string;
}

class PasswordResetQueue {
  private queueName = 'password-reset';
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
      async (job: { data: PasswordResetJobData }) => {
        await this.processJob(job.data);
      }
    );
  }

  async add(data: PasswordResetJobData) {
    return this.queueService.addJob(this.queueName, data);
  }

  private async processJob(data: PasswordResetJobData) {
    try {
      await this.emailService.sendPasswordResetEmail(
        data.email,
        data.resetUrl
      );
    } catch (error:any) {
      throw new Error(`Failed to process password reset: ${error.message}`);
    }
  }
}

export default PasswordResetQueue 