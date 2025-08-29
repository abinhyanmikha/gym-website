import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; //uniform resource identifier-tells how to connect to the database

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }; // conn store actual db connection promise store pending connectiion promise
}
let cached = global.mongoose;

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }); //bufferCommands: false to prevent mongoose from buffering commands if not connected before conn established wont queue
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
