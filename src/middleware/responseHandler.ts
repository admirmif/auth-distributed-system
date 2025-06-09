import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/response';

const responseHandler = (req: Request, res: Response, next: NextFunction):void => {
  res.success = <T>(data: T, message = 'Request was successful') => {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    res.status(200).json(response);
  };

  res.error = (message: string, error?: string, status = 400) => {
    const response: ApiResponse<null> = {
      success: false,
      message,
      error,
    };
    res.status(status).json(response);
  };

  next();
};

export default responseHandler;
