import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
export declare const requireAuth: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (roles: string[]) => (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
export declare const requireCustomer: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map