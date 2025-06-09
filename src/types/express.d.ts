import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Response {
    success<T>(data: T, message?: string): void;
    error(message: string, error?: string, status?: number): void;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `User` with the actual type of your user object
    }
  }
}