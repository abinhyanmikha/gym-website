import mongoose from "mongoose";

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Global mongoose connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we have an existing connection, return it
  if (cached.conn) {
    return cached.conn;
  }
  
  // If we don't have a connection promise yet, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch(err => {
        console.error("MongoDB connection error:", err);
        cached.promise = null;
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    cached.promise = null; // Reset promise on error
    throw error;
  }
}

// Consistent connectDB function for use throughout the application
export async function connectDB() {
  return await dbConnect();
}

// Export the connect function as default
export default dbConnect;
