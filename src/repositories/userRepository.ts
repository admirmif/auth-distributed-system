import { hashPassword } from "../utils/passwordUtils";

class UserRepository {
  prisma: any;
  logger: any;

  constructor(prismaClient: any, logger: any) {
    this.prisma = prismaClient;
    this.logger = logger;
  }

  async create(data:any): Promise<any> {
    try {
      if (data.password) {
        data.password = await hashPassword(data.password);
      }

      const user = await this.prisma.user.create({
        data,
        
      });
      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${JSON.stringify(data)}`, error);
      throw error;
    }
  }

  async findById(id: number): Promise<any | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      
      });
    } catch (error) {
      this.logger.error(`Error finding user with id: ${id}`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<any | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
       
      });
    } catch (error) {
      this.logger.error(`Error finding user with email: ${email}`, error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any> {
    try {
      // Hash password if it's being updated
      if (typeof data.password === 'string') {
        data.password = await hashPassword(data.password);
      }

      return await this.prisma.user.update({
        where: { id },
        data,
       
      });
    } catch (error) {
      this.logger.error(`Error updating user with id: ${id}`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<any> {
    try {
      return await this.prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      this.logger.error(`Error deleting user with id: ${id}`, error);
      throw error;
    }
  }


async updatePassword(id: number, newPassword: string): Promise<any> {
  try {
    const hashedPassword = await hashPassword(newPassword);
    return await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  } catch (error) {
    this.logger.error(`Error updating password for user ${id}`, error);
    throw error;
  }
}

async setPasswordResetToken(email: string, token: string, expiresAt: Date): Promise<any> {
  try {
    return await this.prisma.user.update({
      where: { email },
      data: { 
        passwordResetToken: token,
        passwordResetExpires: expiresAt
      }
    });
  } catch (error) {
    this.logger.error(`Error setting reset token for ${email}`, error);
    throw error;
  }
}

async getUserByResetToken(token: string): Promise<any | null> {
  try {
    return await this.prisma.user.findFirst({
      where: { 
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() }
      }
    });
  } catch (error) {
    this.logger.error(`Error finding user by reset token`, error);
    throw error;
  }
}

async clearResetToken(id: number): Promise<any> {
  try {
    return await this.prisma.user.update({
      where: { id },
      data: { 
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });
  } catch (error) {
    this.logger.error(`Error clearing reset token for user ${id}`, error);
    throw error;
  }
}
}

export default UserRepository;