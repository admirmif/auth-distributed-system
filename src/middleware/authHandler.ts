import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface RequestWithUser extends Request {
  user?: any;
}

const jwtSecret = process.env.JWT_SECRET || 'test'; 

const authGuard = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.error('Token not provided', undefined, 401); 

  jwt.verify(token, jwtSecret, (err, user:any) => {
    if (err) return res.error('Invalid token', err.message, 403); 

    req.user = user as any; 
    next(); 
  });
};

export default authGuard;
