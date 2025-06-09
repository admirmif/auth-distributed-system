import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger: any;

  constructor(logger:any) {
    this.logger = logger
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Welcome to Our Service, ${name}!`,
      html: `
        <h1>Welcome aboard, ${name}!</h1>
        <p>Your account is now active.</p>
        <p>Get started by exploring our platform.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.info(`Welcome email sent to ${email}`);
    } catch (error: any) {
      this.logger.error({
        module: 'EmailService',
        fn: 'sendWelcomeEmail',
        args: {
          email,
        },
        err: error,
      })
      throw new Error('Email sending failed');
    }
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link expires in 1 hour.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.info(`Password reset email sent to ${email}`);
    } catch (error: any) {
      this.logger.error({
        module: 'EmailService',
        fn: 'sendPasswordResetEmail',
        args: {
          email,
        },
        err: error,
      })
      throw new Error('Email sending failed');
    }
  }
}