const mongoose = require("mongoose");

let memoryMode = false;

const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || process.env.USE_IN_MEMORY_DB === "true") {
    memoryMode = true;
    console.log("MongoDB not configured. API is running with the in-memory demo store.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    memoryMode = false;
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    memoryMode = true;
    console.warn(`MongoDB connection failed. Using in-memory demo store. ${error.message}`);
    return false;
  }
};

const isMongoReady = () => !memoryMode && mongoose.connection.readyState === 1;

module.exports = {
  connectDatabase,
  isMongoReady,
};
