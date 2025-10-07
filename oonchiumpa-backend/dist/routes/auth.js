"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const rateLimiter_1 = require("../middleware/rateLimiter");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
// Apply auth rate limiting to all routes
router.use(rateLimiter_1.authRateLimiter);
// Register
router.post('/register', async (req, res, next) => {
    try {
        const { email, name, password, role = 'COMMUNITY_MEMBER' } = req.body;
        // Validate input
        if (!email || !password || password.length < 6) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Email and password (min 6 characters) are required'
            });
        }
        // Check if user already exists
        const existingUser = await index_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'User exists',
                message: 'User with this email already exists'
            });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const user = await index_1.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role.toUpperCase(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        logger_1.logger.info('User registered', { userId: user.id, email: user.email });
        res.status(201).json({
            message: 'User registered successfully',
            user,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
// Login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Email and password are required'
            });
        }
        // Find user
        const user = await index_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Invalid email or password'
            });
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Invalid email or password'
            });
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        logger_1.logger.info('User logged in', { userId: user.id, email: user.email });
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
// Refresh token
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                error: 'No token',
                message: 'Refresh token is required'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await index_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
            }
        });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'User not found'
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({
            accessToken,
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map