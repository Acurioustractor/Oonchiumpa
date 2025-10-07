"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Admin dashboard stats
router.get('/stats', async (req, res, next) => {
    try {
        // Mock stats - will be implemented with real data
        const stats = {
            totalStories: 0,
            totalOutcomes: 0,
            totalMediaItems: 0,
            pendingApprovals: 0,
            totalUsers: 0,
            recentActivity: []
        };
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map