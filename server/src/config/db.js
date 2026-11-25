import mongoose from 'mongoose';

let mongodInstance = null;

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI;

  // ---------------------------------------------------------------------------
  // Production Environment: MongoDB Atlas is strictly mandatory
  // ---------------------------------------------------------------------------
  if (isProduction) {
    if (!uri || !uri.trim()) {
      console.error('\n============================================================');
      console.error('FATAL CONFIGURATION ERROR: MONGODB_URI is not defined.');
      console.error('In production (Render), a valid MongoDB Atlas connection string is required.');
      console.error('Action required: Set MONGODB_URI in your Render environment variables.');
      console.error('============================================================\n');
      process.exit(1);
    }

    try {
      console.log('Connecting to MongoDB Atlas (Production)...');
      // Set 10-second timeout to allow for DNS SRV resolution and TLS handshake on cold start
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error('\n============================================================');
      console.error('FATAL DATABASE ERROR: MongoDB Atlas connection failed in production:');
      console.error(error.message);
      console.error('\nTroubleshooting Checklist for Render:');
      console.error('1. Check MONGODB_URI in Render dashboard: verify cluster URL, username, and password.');
      console.error('2. Special characters in MongoDB password must be URL-encoded (e.g. %40 for @, %23 for #).');
      console.error('3. In MongoDB Atlas > Network Access, add IP Address 0.0.0.0/0 (Allow access from anywhere).');
      console.error('   Render dynamically allocates outbound IPs, so Atlas must whitelist 0.0.0.0/0.');
      console.error('============================================================\n');
      process.exit(1);
    }
  }

  // ---------------------------------------------------------------------------
  // Non-Production (Development / Testing) Environment
  // ---------------------------------------------------------------------------
  // 1. Try remote MongoDB / Atlas if configured in development
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

  // 2. Try local MongoDB if URI points to localhost:27017
  if (uri && uri.includes('localhost:27017')) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.log('Local MongoDB not running, initializing embedded instance...');
    }
  }

  // 3. Fallback to in-memory database strictly for development/testing
  try {
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
      mongodInstance = null;
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
