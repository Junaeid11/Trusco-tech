import { Request, Response, NextFunction } from 'express';
import { AppError } from './../utils/errors';
import logger from './../utils/logger';
import { ApiResponse } from '@/types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';
  let details: any = undefined;

  // Handle AppError instances
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = (error as any).details;
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = Object.values((error as any).errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
    code = 'DUPLICATE_ERROR';
    const field = Object.keys((error as any).keyPattern)[0];
    details = { field, value: (error as any).keyValue[field as string] };
  }
  // Handle Mongoose cast errors
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
    details = { field: (error as any).path, value: (error as any).value };
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error('Server Error:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      
      userAgent: req.get('User-Agent'),
    });
  } else {
    logger.warn('Client Error:', {
      error: error.message,
      statusCode,
      url: req.url,
      method: req.method,
    });
  }

  // Send error response
  const response: ApiResponse = {
    success: false,
    message,
    code,
  };

  if (details) {
    response.details = details;
  }

  // Don't send error details in production
  if (process.env['NODE_ENV'] === 'production' && statusCode >= 500) {
    response.message = 'Internal Server Error';
    response.details = undefined;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  next(error);
};
