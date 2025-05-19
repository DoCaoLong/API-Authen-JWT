import { Request, Response, NextFunction } from 'express';
import { HttpError } from '~/utils/HttpError';

const isProduction = process.env.NODE_ENV === 'production';

// This middleware handles errors that occur during the request processing
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!isProduction) {
    console.error(`❌ Error: ${err.message}`);
    console.error(err.stack);
  }
  
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        ...(isProduction ? {} : { stack: err.stack })
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal Server Error',
      ...(isProduction ? {} : { stack: err.stack })
    }
  });
};

// Middleware xử lý lỗi 404
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Resource not found',
      path: req.originalUrl
    }
  });
};