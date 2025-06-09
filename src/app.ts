import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/database';
import { container } from './container';
import authRoutes from './api/authRoutes';
import responseHandler from './middleware/responseHandler';

async function bootstrap() {
  await connectDB();
  console.log('Database connected successfully');

  container.queues.passwordResetQueue;
  container.queues.welcomeEmailQueue;
  console.log('Queues initialized');

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(cors());
  app.use(responseHandler);

  app.use('/api/auth', authRoutes(container.authController));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});