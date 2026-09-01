import mongoose from 'mongoose';

/**
 * Connect to MongoDB.
 *
 * In local development we allow an in-memory Mongo fallback.
 * In production (Render), we require a real MONGO_URI to avoid broken deployments.
 */
export async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is required in production. Set it in the Render environment variables.');
    }

    // Lazy import so production installs don't need the dev dependency.
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    console.log('⚙️  No MONGO_URI found — started in-memory MongoDB for local dev.');

    // Store so it can be stopped on shutdown.
    global.__MONGOD__ = mongod;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'skillbridge' });

  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
}
