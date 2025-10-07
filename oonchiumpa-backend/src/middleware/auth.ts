import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Extend Express Request type to include user
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

const JWT_SECRET = process.env.JWT_SECRET || 'oonchiumpa-secret-key-2025';

// Role hierarchy and permissions - supporting both uppercase and lowercase
const ROLE_PERMISSIONS = {
  ADMIN: [
    'content.generate',
    'content.publish',
    'content.delete',
    'ai.access',
    'ai.configure',
    'cultural.override',
    'users.manage',
    'analytics.view'
  ],
  admin: [
    'content.generate',
    'content.publish',
    'content.delete',
    'ai.access',
    'ai.configure',
    'cultural.override',
    'users.manage',
    'analytics.view'
  ],
  ELDER: [
    'content.review',
    'cultural.review',
    'cultural.approve',
    'content.flag',
    'content.generate'
  ],
  elder: [
    'content.review',
    'cultural.review',
    'cultural.approve',
    'content.flag',
    'content.generate'
  ],
  COMMUNITY_COORDINATOR: [
    'content.generate',
    'content.publish',
    'content.edit',
    'ai.access',
    'cultural.review',
    'analytics.view'
  ],
  COMMUNITY_MEMBER: [
    'content.view',
    'content.suggest',
    'content.comment'
  ],
  community: [
    'content.view',
    'content.suggest',
    'content.comment'
  ],
  public: [
    'content.view'
  ]
};

/**
 * Verify JWT token and attach user to request
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: ROLE_PERMISSIONS[decoded.role as keyof typeof ROLE_PERMISSIONS] || []
    };
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Check if user has required permission
 */
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!req.user.permissions.includes(permission)) {
      logger.warn(`Permission denied: ${req.user.email} attempted ${permission}`);
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Check if user has one of the required roles
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Role denied: ${req.user.email} with role ${req.user.role} attempted access requiring ${roles.join(' or ')}`);
      return res.status(403).json({
        success: false,
        error: 'Access denied for your role'
      });
    }

    next();
  };
};

/**
 * Optional authentication - attaches user if token present but doesn't require it
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = {
      id: 'anonymous',
      email: 'anonymous@public',
      role: 'public',
      permissions: ROLE_PERMISSIONS.public
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: ROLE_PERMISSIONS[decoded.role as keyof typeof ROLE_PERMISSIONS] || []
    };
  } catch (error) {
    req.user = {
      id: 'anonymous',
      email: 'anonymous@public',
      role: 'public',
      permissions: ROLE_PERMISSIONS.public
    };
  }
  
  next();
};

/**
 * Generate JWT token for user
 */
export const generateToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
};

/**
 * Special middleware for AI content generation endpoints
 */
export const requireAIAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required for AI features'
    });
  }

  const allowedRoles = ['admin', 'oonchiumpa', 'ADMIN', 'ELDER', 'COMMUNITY_COORDINATOR'];
  
  if (!allowedRoles.includes(req.user.role)) {
    logger.warn(`AI access denied: ${req.user.email} with role ${req.user.role}`);
    return res.status(403).json({
      success: false,
      error: 'AI content generation is restricted to Oonchiumpa staff and administrators'
    });
  }

  // Log AI usage for monitoring
  logger.info(`AI access granted: ${req.user.email} (${req.user.role})`);
  
  next();
};