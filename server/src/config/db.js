import mongoose from 'mongoose';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('localhost:27017')) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`MongoDB Atlas connection warning: ${error.message}`);
      console.log('Falling back to local/in-memory database instance for testing...');
    }
  }

  // Fallback for offline testing or when MongoDB Atlas URI is not yet configured in .env
  try {
    if (uri && uri.includes('localhost:27017')) {
      try {
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.log('Local MongoDB not running, initializing embedded instance...');
      }
    }

    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`MongoDB Connected (In-Memory Engine): ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
