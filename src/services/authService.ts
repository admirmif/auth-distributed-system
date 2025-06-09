import { comparePassword } from '../utils/passwordUtils';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class AuthService {
  private userRepository: any;
  private welcomeEmailQueue: any;
  private passwordResetQueue: any;
  private logger: any;

  constructor(userRepository: any,welcomeEmailQueue:any,passwordResetQueue:any, logger: any) {
    this.userRepository = userRepository;
    this.welcomeEmailQueue = welcomeEmailQueue;
    this.passwordResetQueue = passwordResetQueue;
    this.logger = logger;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const { name, email, password } = userData;

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw { 
          message: 'User already exists', 
          statusCode: 400 
        };
      }

      const user = await this.userRepository.create({
        name,
        email,
        password,
      });

      await this.welcomeEmailQueue.add({
        userId: user.id,
        email: user.email,
        name: user.name,
      });


      const token = this.generateToken(user);
      this.logger.info(`User registered successfully: ${email}`);

      return { user, token };
    } catch (error: any) {
      this.logger.error(`Registration error: ${error.message}`, { error });
      throw { 
        message: error.message || 'Registration failed',
        statusCode: error.statusCode || 500 
      };
    }
  }

  async login(email: string, password: string) {
    try {
      
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw { 
          message: 'User not found', 
          statusCode: 404 
        };
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw { 
          message: 'Invalid credentials', 
          statusCode: 401 
        };
      }

      const token = this.generateToken(user);
      this.logger.info(`User logged in successfully: ${email}`);

      return { user, token };
    } catch (error: any) {
      this.logger.error(`Login error: ${error.message}`, { error });
      throw { 
        message: error.message || 'Login failed',
        statusCode: error.statusCode || 500 
      };
    }
  }

  async getCurrentUser(userId: string) {
    try {
      
      if (!userId) {
        throw { 
          message: 'Unauthorized', 
          statusCode: 401 
        };
      }
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw { 
          message: 'User not found', 
          statusCode: 404 
        };
      }

      return user;
    } catch (error: any) {
      this.logger.error(`Get current user error: ${error.message}`, { error });
      throw { 
        message: error.message || 'Failed to get current user',
        statusCode: error.statusCode || 500 
      };
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw { 
          message: 'User not found', 
          statusCode: 404 
        };
      }

      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        throw { 
          message: 'Current password is incorrect', 
          statusCode: 400 
        };
      }

      await this.userRepository.updatePassword(user.id, newPassword);
      this.logger.info(`Password changed successfully for user: ${userId}`);
    } catch (error: any) {
      this.logger.error(`Change password error: ${error.message}`, { error });
      throw { 
        message: error.message || 'Failed to change password',
        statusCode: error.statusCode || 500 
      };
    }
  }

  async forgotPassword(email: string) {
    try {
      
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return; 
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000);

      await this.userRepository.setPasswordResetToken(email, resetToken, resetExpires);

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await this.passwordResetQueue.add({
        email: user.email,
        resetUrl,
        userId: user.id,
      });
      
      this.logger.info(`Password reset email will be sent to: ${email}`);
    } catch (error: any) {
      this.logger.error(`Forgot password error: ${error.message}`, { error });
      throw { 
        message: 'Failed to process password reset',
        statusCode: 500 
      };
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      
      const user = await this.userRepository.getUserByResetToken(token);
      if (!user) {
        throw { 
          message: 'Invalid or expired token', 
          statusCode: 400 
        };
      }

      await this.userRepository.updatePassword(user.id, newPassword);
      await this.userRepository.clearResetToken(user.id);
      
      this.logger.info(`Password reset successfully for user: ${user.email}`);
    } catch (error: any) {
      this.logger.error(`Reset password error: ${error.message}`, { error });
      throw { 
        message: error.message || 'Failed to reset password',
        statusCode: error.statusCode || 500 
      };
    }
  }

  private generateToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );
  }
}

export default AuthService;