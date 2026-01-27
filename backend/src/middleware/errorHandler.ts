import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Error]', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation error',
      details: error.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    res.status(409).json({
      error: `${field} already exists`,
    });
    return;
  }

  // Generic server error
  res.status(500).json({
    error: 'Internal server error',
  });
};
