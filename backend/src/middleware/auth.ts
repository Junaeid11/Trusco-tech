import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './../config';
import { User } from './../modules/users/user.model';
import { AuthenticationError, AuthorizationError } from './../utils/errors';
import { AuthenticatedRequest, JWTPayload } from '@/types';

export const requireAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies['accessToken'] || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret) as JWTPayload;
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AuthorizationError(`Access denied. Required roles: ${roles.join(', ')}`));
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireCustomer = requireRole(['customer', 'admin']);

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies['accessToken'] || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret) as JWTPayload;
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};
