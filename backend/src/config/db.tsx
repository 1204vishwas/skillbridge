import mongoose from 'mongoose';
import type { MongoMemoryServer } from 'mongodb-memory-server';

// Holds the in-memory Mongo instance (dev only) so it can be stopped on shutdown.
let memoryServer: MongoMemoryServer | undefined;

/**
 * Connect to MongoDB.
 *
 * In local development we allow an in-memory Mongo fallback.
 * In production (Render), we require a real MONGO_URI to avoid broken deployments.
 */
export async function connectDB(): Promise<void> {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is required in production. Set it in the Render environment variables.');
    }

    // Lazy import so production installs don't need the dev dependency.
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log('⚙️  No MONGO_URI found — started in-memory MongoDB for local dev.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'skillbridge' });

  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}
