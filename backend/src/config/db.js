import mongoose from 'mongoose';

/**
 * Connect to MongoDB.
 *
 * If MONGO_URI is provided we connect to that database.
 * Otherwise we boot an in-memory MongoDB instance so the project runs
 * out-of-the-box without any external database setup.
 */
export async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (!uri) {
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
