import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using MONGO_URI from .env
 * Exits the process on failure so the app never runs without a DB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const { host, port, name, readyState } = conn.connection
    console.log(`✅ MongoDB Atlas Connected`);
    console.log(`   Host      : ${host}:${port}`);
    console.log(`   Database  : ${name}`);
    console.log(`   State     : ${readyState === 1 ? 'connected' : readyState}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
