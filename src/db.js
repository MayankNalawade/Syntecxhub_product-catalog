const mongoose = require("mongoose");

async function connectDb() {
  let uri = process.env.MONGODB_URI;

  if (process.env.USE_MEMORY_DB === "true") {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const memory = await MongoMemoryServer.create();
    uri = memory.getUri();
    console.log("Using in-memory MongoDB");
  }

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env");
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("Connected to MongoDB");
}

module.exports = connectDb;
