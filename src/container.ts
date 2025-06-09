import { prisma } from './config/database';
import logger from './utils/logger'; 

import QueueService from './services/queueService';
import AuthService from './services/authService';
import UserRepository from './repositories/userRepository'

import PasswordResetQueue from './queues/passwordReset.queue';
import WelcomeEmailQueue from './queues/welcomeEmail.queue';
import IORedis from 'ioredis';
import { EmailService } from './services/emailService';
import AuthController from './controllers/authController';

// Redis connection
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://redis:6379', {
  maxRetriesPerRequest: null,
});

//Repositories
const userRepository = new UserRepository(prisma, logger);

//Services
const emailService = new EmailService(logger)
const queueService = new QueueService(redisConnection, logger);
const welcomeEmailQueue = new WelcomeEmailQueue(queueService, emailService);
const passwordResetQueue = new PasswordResetQueue(queueService,emailService)

const authService = new AuthService(userRepository,welcomeEmailQueue,passwordResetQueue,logger);
const authController = new AuthController(authService)

export const container = {
  authController,
  authService,
  queueService,
  emailService,
  userRepository,
  queues: {
    passwordResetQueue,
    welcomeEmailQueue
  }
};