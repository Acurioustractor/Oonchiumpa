#!/usr/bin/env tsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const seedData_1 = require("../utils/seedData");
const seedCulturalAdvisory_1 = require("../utils/seedCulturalAdvisory");
const prisma = new client_1.PrismaClient();
async function main() {
    const action = process.argv[2];
    try {
        if (action === 'clear') {
            await (0, seedData_1.clearDatabase)(prisma);
        }
        else {
            await (0, seedData_1.seedDatabase)(prisma);
            await (0, seedCulturalAdvisory_1.seedCulturalAdvisorySystem)(prisma);
        }
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=seed.js.map