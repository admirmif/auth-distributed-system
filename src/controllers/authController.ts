import { Request, Response } from 'express';

class AuthController {
  private authService: any;

  constructor(authService:any) {
    this.authService = authService
  }

   async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.register({ name, email, password });
      res.success({ user: result.user, token: result.token }, 'User registered successfully');
    } catch (error: any) {
      res.error('Registration failed', error.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.success({ user: result.user, token: result.token }, 'Login successful');
    } catch (error: any) {
      res.error('Login failed', error.message, 401);
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await this.authService.getCurrentUser(userId);
      res.success(user, 'Current user retrieved successfully');
    } catch (error: any) {
      res.error('Failed to get current user', error.message, error.statusCode || 500);
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, currentPassword, newPassword);
      res.success(null, 'Password changed successfully');
    } catch (error: any) {
      res.error('Failed to change password', error.message, error.statusCode || 400);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.success(null, 'If the email exists, a reset link has been sent');
    } catch (error: any) {
      res.error('Failed to process password reset', error.message, 500);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      res.success(null, 'Password has been reset successfully');
    } catch (error: any) {
      res.error('Failed to reset password', error.message, 400);
    }
  }
}

export default AuthController;