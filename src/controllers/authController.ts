import { Request, Response } from 'express';

class AuthController {
  private authService: any;

  constructor(authService:any) {
    this.authService = authService
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.register({ 
        name, 
        email, 
        password, 
      });
      res.status(201).json({
        success: true,
        data: result.user,
        token: result.token,
        message: 'User registered successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json({
        success: true,
        data: result.user,
        token: result.token,
        message: 'Login successful'
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await this.authService.getCurrentUser(userId);
      res.json({
        success: true,
        data: user,
        message: 'Current user retrieved successfully'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get current user'
      });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, currentPassword, newPassword);
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Failed to change password'
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process password reset'
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      res.json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reset password'
      });
    }
  }
}

export default AuthController;