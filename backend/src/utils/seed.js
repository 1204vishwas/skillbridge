import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

/**
 * Standalone seed runner. Use with a real MONGO_URI to persist demo data:
 *   MONGO_URI=mongodb://127.0.0.1:27017/skillbridge npm run seed
 */
async function run() {
  await connectDB();
  console.log('🌱 Seeding database...');
  await seedDatabase({ clear: true });
  console.log('\n✅ Seed complete! Demo accounts (password: password123):');
  console.log('  Admin     -> admin@skillbridge.dev');
  console.log('  Recruiter -> recruiter@skillbridge.dev');
  console.log('  Student   -> student@skillbridge.dev\n');
  await disconnectDB();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
