import { Request, Response, NextFunction } from 'express';

// This middleware handles errors that occur during the request processing
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
};
// This middleware handles 404 errors for routes that are not found
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
};  
