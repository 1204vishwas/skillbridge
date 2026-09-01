import 'dotenv/config';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import User from './models/User.js';
import { seedDatabase } from './utils/seedData.js';

const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

async function start() {
  try {
    await connectDB();

    // Auto-seed demo data when the database is empty (e.g. in-memory dev DB).
    const userCount = await User.estimatedDocumentCount();
    if (userCount === 0) {
      console.log('🌱 Empty database detected — seeding demo data...');
      await seedDatabase();
      console.log('   Demo login: student@skillbridge.dev / password123');
    }
    const server = app.listen(PORT, HOST, () => {
      const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      console.log(`🚀 SkillBridge API running on ${url}`);
    });

    const shutdown = async () => {
      console.log('\nShutting down...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
