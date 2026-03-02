const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUris = [process.env.MONGO_URI, process.env.MONGO_URI_DIRECT].filter(Boolean);

  if (mongoUris.length === 0) {
    console.error("MongoDB Connection Failed: set MONGO_URI or MONGO_URI_DIRECT in .env");
    process.exit(1);
  }

  let lastError;

  for (const uri of mongoUris) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 });
      console.log("Connected DB:", mongoose.connection.name);
      return;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connect failed for ${uri}:`, error.message);

      // ensure next attempt starts cleanly
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect().catch(() => {});
      }
    }
  }

  if (lastError?.message?.includes("querySrv ECONNREFUSED")) {
    console.error(
      "MongoDB Connection Failed: DNS SRV lookup was refused. Atlas DNS may be blocked. Using MONGO_URI_DIRECT (mongodb://127.0.0.1:27017/...) is recommended for local dev."
    );
  }

  process.exit(1);
};

module.exports = connectDB;
