#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client';
import { seedDatabase, clearDatabase } from '../utils/seedData';
import { seedCulturalAdvisorySystem } from '../utils/seedCulturalAdvisory';

const prisma = new PrismaClient();

async function main() {
  const action = process.argv[2];
  
  try {
    if (action === 'clear') {
      await clearDatabase(prisma);
    } else {
      await seedDatabase(prisma);
      await seedCulturalAdvisorySystem(prisma);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();