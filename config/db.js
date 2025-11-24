const mongoose = require('mongoose');

let isConnected = false; // <-- IMPORTANT (caches connection)

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = conn.connections[0].readyState === 1; // 1 = connected
    console.log(`MongoDB Connected: ${conn.connection.name}`);

  } catch (err) {
    console.error("MongoDB error:", err.message);
    throw err; // DO NOT exit in serverless
  }
};

module.exports = connectDB;
