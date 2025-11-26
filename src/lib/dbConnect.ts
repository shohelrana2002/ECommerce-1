import mongoose from "mongoose";
const mongoDBUrl = process.env.DB_URL;

if (!mongoDBUrl) {
  throw new Error(" server connect error: DB_URL missing in environment");
}
// step-----2
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
// step-------->3
const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoDBUrl)
      .then((conn) => conn.connection);
  }
  try {
    const conn = await cached.promise;
    return conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
