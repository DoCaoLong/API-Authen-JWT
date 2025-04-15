import { Request, Response, NextFunction } from 'express';
import { HttpError } from '~/utils/HttpError';

// This middleware handles errors that occur during the request processing
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal Server Error' });
};

// This middleware handles 404 errors for routes that are not found
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
};  