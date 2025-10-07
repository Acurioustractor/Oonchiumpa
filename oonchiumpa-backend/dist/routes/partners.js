"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock data for partners until database is updated
const mockPartners = [
    {
        id: "1",
        name: "Northern Territory Department of Health",
        type: "GOVERNMENT",
        category: "Government",
        description: "Key partner supporting youth health and wellbeing programs across remote Northern Territory communities.",
        website: "https://health.nt.gov.au",
        logo: null,
        isActive: true,
        partnershipLevel: "CORE_PARTNER",
        monetaryValue: 125000,
        inKindValue: 50000,
        location: "Darwin, NT",
        communityConnections: [
            "Arnhem Land",
            "Central Australia",
            "Katherine Region",
        ],
        relationshipStart: "2022-01-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Reconciliation Australia",
        type: "NGO",
        category: "Community Organization",
        description: "National organization promoting reconciliation between Aboriginal and Torres Strait Islander peoples and non-Indigenous Australians.",
        website: "https://www.reconciliation.org.au",
        logo: null,
        isActive: true,
        partnershipLevel: "STRATEGIC_PARTNER",
        monetaryValue: 75000,
        inKindValue: 25000,
        location: "Canberra, ACT",
        communityConnections: [
            "National Indigenous Communities",
            "Urban Aboriginal Communities",
        ],
        relationshipStart: "2021-08-20",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "BHP Foundation",
        type: "CORPORATE",
        category: "Corporate Foundation",
        description: "Supporting Indigenous youth education and leadership development programs through significant funding and mentorship opportunities.",
        website: "https://www.bhp.com/sustainability/communities/bhp-foundation",
        logo: null,
        isActive: true,
        partnershipLevel: "LEGACY_PARTNER",
        monetaryValue: 200000,
        inKindValue: 100000,
        location: "Melbourne, VIC",
        communityConnections: [
            "Pilbara Communities",
            "Hunter Valley",
            "Olympic Dam Region",
        ],
        relationshipStart: "2020-03-10",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "4",
        name: "University of Melbourne - Indigenous Studies",
        type: "EDUCATIONAL",
        category: "Educational",
        description: "Research collaboration and student placement partnerships supporting evidence-based program development.",
        website: "https://indigenous.unimelb.edu.au",
        logo: null,
        isActive: true,
        partnershipLevel: "COLLABORATOR",
        monetaryValue: 0,
        inKindValue: 30000,
        location: "Melbourne, VIC",
        communityConnections: [
            "Victorian Aboriginal Communities",
            "Research Networks",
        ],
        relationshipStart: "2023-02-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "5",
        name: "Australian Red Cross",
        type: "NGO",
        category: "NGO",
        description: "Partnership in emergency response and community resilience programs, particularly in remote Indigenous communities.",
        website: "https://www.redcross.org.au",
        logo: null,
        isActive: true,
        partnershipLevel: "STRATEGIC_PARTNER",
        monetaryValue: 85000,
        inKindValue: 40000,
        location: "Melbourne, VIC",
        communityConnections: [
            "Remote NT Communities",
            "WA Aboriginal Communities",
            "SA Anangu Communities",
        ],
        relationshipStart: "2021-11-30",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "6",
        name: "Wesfarmers Arts",
        type: "CORPORATE",
        category: "Corporate",
        description: "Supporting Indigenous arts and cultural expression programs, providing both funding and exhibition opportunities.",
        website: "https://www.wesfarmers.com.au",
        logo: null,
        isActive: true,
        partnershipLevel: "COLLABORATOR",
        monetaryValue: 45000,
        inKindValue: 15000,
        location: "Perth, WA",
        communityConnections: ["Kimberley Artists", "Desert Art Cooperatives"],
        relationshipStart: "2022-07-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "7",
        name: "Indigenous Protected Area Network",
        type: "COMMUNITY_ORGANIZATION",
        category: "Cultural Organization",
        description: "Land-based partnerships supporting traditional knowledge sharing and country management programs.",
        website: "https://www.niaa.gov.au/indigenous-affairs/environment/indigenous-protected-areas",
        logo: null,
        isActive: true,
        partnershipLevel: "CORE_PARTNER",
        monetaryValue: 150000,
        inKindValue: 200000,
        location: "Multiple Locations",
        communityConnections: [
            "Arnhem Land Rangers",
            "Central Desert Rangers",
            "Kimberley Land Council",
        ],
        relationshipStart: "2020-09-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "8",
        name: "KPMG Indigenous Consulting",
        type: "CORPORATE",
        category: "Professional Services",
        description: "Pro-bono consulting services for organizational development, impact measurement, and strategic planning.",
        website: "https://home.kpmg/au/en/home/services/advisory/indigenous-consulting.html",
        logo: null,
        isActive: true,
        partnershipLevel: "COLLABORATOR",
        monetaryValue: 0,
        inKindValue: 80000,
        location: "Sydney, NSW",
        communityConnections: ["Corporate Indigenous Networks"],
        relationshipStart: "2023-01-20",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
// GET /api/partners - Fetch partners with filtering
router.get("/", async (req, res) => {
    try {
        const { active, level, category, type, limit = "50", offset = "0", } = req.query;
        let filteredPartners = [...mockPartners];
        // Filter by active status
        if (active !== undefined) {
            const isActive = active === "true";
            filteredPartners = filteredPartners.filter((partner) => partner.isActive === isActive);
        }
        // Filter by partnership level
        if (level && typeof level === "string") {
            filteredPartners = filteredPartners.filter((partner) => partner.partnershipLevel === level);
        }
        // Filter by category
        if (category && typeof category === "string") {
            filteredPartners = filteredPartners.filter((partner) => partner.category.toLowerCase().includes(category.toLowerCase()));
        }
        // Filter by type
        if (type && typeof type === "string") {
            filteredPartners = filteredPartners.filter((partner) => partner.type === type);
        }
        // Apply pagination
        const limitNum = parseInt(limit) || 50;
        const offsetNum = parseInt(offset) || 0;
        const paginatedPartners = filteredPartners.slice(offsetNum, offsetNum + limitNum);
        // Calculate totals for statistics
        const stats = {
            totalPartners: filteredPartners.length,
            totalValue: filteredPartners.reduce((sum, p) => sum + (p.monetaryValue || 0) + (p.inKindValue || 0), 0),
            partnershipLevels: {
                prospect: filteredPartners.filter((p) => p.partnershipLevel === "PROSPECT").length,
                collaborator: filteredPartners.filter((p) => p.partnershipLevel === "COLLABORATOR").length,
                strategic: filteredPartners.filter((p) => p.partnershipLevel === "STRATEGIC_PARTNER").length,
                core: filteredPartners.filter((p) => p.partnershipLevel === "CORE_PARTNER").length,
                legacy: filteredPartners.filter((p) => p.partnershipLevel === "LEGACY_PARTNER").length,
            },
            totalCommunities: [
                ...new Set(filteredPartners.flatMap((p) => p.communityConnections)),
            ].length,
        };
        res.json({
            partners: paginatedPartners,
            pagination: {
                total: filteredPartners.length,
                limit: limitNum,
                offset: offsetNum,
                hasMore: offsetNum + limitNum < filteredPartners.length,
            },
            stats,
        });
    }
    catch (error) {
        console.error("Error fetching partners:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /api/partners/:id - Fetch single partner
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const partner = mockPartners.find((p) => p.id === id);
        if (!partner) {
            return res.status(404).json({ error: "Partner not found" });
        }
        res.json(partner);
    }
    catch (error) {
        console.error("Error fetching partner:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /api/partners - Create new partner (admin only)
router.post("/", async (req, res) => {
    try {
        // TODO: Add authentication middleware
        const { name, type, category, description, website, logo, partnershipLevel = "PROSPECT", monetaryValue = 0, inKindValue = 0, location, communityConnections = [], } = req.body;
        if (!name || !type || !category) {
            return res
                .status(400)
                .json({ error: "Name, type, and category are required" });
        }
        const newPartner = {
            id: (mockPartners.length + 1).toString(),
            name,
            type,
            category,
            description,
            website,
            logo,
            isActive: true,
            partnershipLevel,
            monetaryValue: parseFloat(monetaryValue) || 0,
            inKindValue: parseFloat(inKindValue) || 0,
            location,
            communityConnections: Array.isArray(communityConnections)
                ? communityConnections
                : [communityConnections].filter(Boolean),
            relationshipStart: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockPartners.push(newPartner);
        res.status(201).json({
            message: "Partner created successfully",
            partner: newPartner,
        });
    }
    catch (error) {
        console.error("Error creating partner:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// PUT /api/partners/:id - Update partner (admin only)
router.put("/:id", async (req, res) => {
    try {
        // TODO: Add authentication middleware
        const { id } = req.params;
        const partnerIndex = mockPartners.findIndex((p) => p.id === id);
        if (partnerIndex === -1) {
            return res.status(404).json({ error: "Partner not found" });
        }
        const updatedPartner = {
            ...mockPartners[partnerIndex],
            ...req.body,
            id, // Ensure ID cannot be changed
            updatedAt: new Date().toISOString(),
        };
        mockPartners[partnerIndex] = updatedPartner;
        res.json({
            message: "Partner updated successfully",
            partner: updatedPartner,
        });
    }
    catch (error) {
        console.error("Error updating partner:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// DELETE /api/partners/:id - Soft delete partner (admin only)
router.delete("/:id", async (req, res) => {
    try {
        // TODO: Add authentication middleware
        const { id } = req.params;
        const partnerIndex = mockPartners.findIndex((p) => p.id === id);
        if (partnerIndex === -1) {
            return res.status(404).json({ error: "Partner not found" });
        }
        // Soft delete by setting isActive to false
        mockPartners[partnerIndex].isActive = false;
        mockPartners[partnerIndex].updatedAt = new Date().toISOString();
        res.json({
            message: "Partner deactivated successfully",
        });
    }
    catch (error) {
        console.error("Error deactivating partner:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /api/partners/stats/summary - Get partnership statistics
router.get("/stats/summary", async (req, res) => {
    try {
        const activePartners = mockPartners.filter((p) => p.isActive);
        const stats = {
            totalPartners: activePartners.length,
            totalMonetaryValue: activePartners.reduce((sum, p) => sum + (p.monetaryValue || 0), 0),
            totalInKindValue: activePartners.reduce((sum, p) => sum + (p.inKindValue || 0), 0),
            totalValue: activePartners.reduce((sum, p) => sum + (p.monetaryValue || 0) + (p.inKindValue || 0), 0),
            partnershipLevels: {
                prospect: activePartners.filter((p) => p.partnershipLevel === "PROSPECT").length,
                collaborator: activePartners.filter((p) => p.partnershipLevel === "COLLABORATOR").length,
                strategic: activePartners.filter((p) => p.partnershipLevel === "STRATEGIC_PARTNER").length,
                core: activePartners.filter((p) => p.partnershipLevel === "CORE_PARTNER").length,
                legacy: activePartners.filter((p) => p.partnershipLevel === "LEGACY_PARTNER").length,
            },
            partnerTypes: {
                government: activePartners.filter((p) => p.type === "GOVERNMENT")
                    .length,
                ngo: activePartners.filter((p) => p.type === "NGO").length,
                corporate: activePartners.filter((p) => p.type === "CORPORATE").length,
                educational: activePartners.filter((p) => p.type === "EDUCATIONAL")
                    .length,
                community: activePartners.filter((p) => p.type === "COMMUNITY_ORGANIZATION").length,
            },
            totalCommunities: [
                ...new Set(activePartners.flatMap((p) => p.communityConnections)),
            ].length,
            communityConnections: [
                ...new Set(activePartners.flatMap((p) => p.communityConnections)),
            ],
        };
        res.json(stats);
    }
    catch (error) {
        console.error("Error fetching partner stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=partners.js.map