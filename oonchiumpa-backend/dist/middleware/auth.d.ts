import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: 'admin' | 'oonchiumpa' | 'elder' | 'community' | 'public';
                permissions: string[];
            };
        }
    }
}
/**
 * Verify JWT token and attach user to request
 */
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Check if user has required permission
 */
export declare const requirePermission: (permission: string) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Check if user has one of the required roles
 */
export declare const requireRole: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Optional authentication - attaches user if token present but doesn't require it
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Generate JWT token for user
 */
export declare const generateToken: (user: {
    id: string;
    email: string;
    role: string;
}) => string;
/**
 * Special middleware for AI content generation endpoints
 */
export declare const requireAIAccess: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map