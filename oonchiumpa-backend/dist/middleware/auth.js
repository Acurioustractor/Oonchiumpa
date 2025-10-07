"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAIAccess = exports.generateToken = exports.optionalAuth = exports.requireRole = exports.requirePermission = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
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
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token required'
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            permissions: ROLE_PERMISSIONS[decoded.role] || []
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Token verification failed:', error);
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Check if user has required permission
 */
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        if (!req.user.permissions.includes(permission)) {
            logger_1.logger.warn(`Permission denied: ${req.user.email} attempted ${permission}`);
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
        }
        next();
    };
};
exports.requirePermission = requirePermission;
/**
 * Check if user has one of the required roles
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        if (!roles.includes(req.user.role)) {
            logger_1.logger.warn(`Role denied: ${req.user.email} with role ${req.user.role} attempted access requiring ${roles.join(' or ')}`);
            return res.status(403).json({
                success: false,
                error: 'Access denied for your role'
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Optional authentication - attaches user if token present but doesn't require it
 */
const optionalAuth = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            permissions: ROLE_PERMISSIONS[decoded.role] || []
        };
    }
    catch (error) {
        req.user = {
            id: 'anonymous',
            email: 'anonymous@public',
            role: 'public',
            permissions: ROLE_PERMISSIONS.public
        };
    }
    next();
};
exports.optionalAuth = optionalAuth;
/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, JWT_SECRET, {
        expiresIn: '7d'
    });
};
exports.generateToken = generateToken;
/**
 * Special middleware for AI content generation endpoints
 */
const requireAIAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required for AI features'
        });
    }
    const allowedRoles = ['admin', 'oonchiumpa', 'ADMIN', 'ELDER', 'COMMUNITY_COORDINATOR'];
    if (!allowedRoles.includes(req.user.role)) {
        logger_1.logger.warn(`AI access denied: ${req.user.email} with role ${req.user.role}`);
        return res.status(403).json({
            success: false,
            error: 'AI content generation is restricted to Oonchiumpa staff and administrators'
        });
    }
    // Log AI usage for monitoring
    logger_1.logger.info(`AI access granted: ${req.user.email} (${req.user.role})`);
    next();
};
exports.requireAIAccess = requireAIAccess;
//# sourceMappingURL=auth.js.map