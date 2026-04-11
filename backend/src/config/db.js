const mongoose = require("mongoose");

const isSrvDnsError = (message = "") =>
  message.includes("querySrv ECONNREFUSED") ||
  message.includes("querySrv ENOTFOUND") ||
  message.includes("querySrv ETIMEOUT");

const connectWithUri = async (uri, label) => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`Connected DB (${label}):`, mongoose.connection.name);
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const directMongoUri = process.env.MONGO_URI_DIRECT;

  if (!mongoUri) {
    console.error("MongoDB Connection Failed: MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    await connectWithUri(mongoUri, "primary");
  } catch (error) {
    if (isSrvDnsError(error.message) && directMongoUri) {
      try {
        console.warn(
          "MongoDB SRV DNS lookup failed. Retrying with MONGO_URI_DIRECT fallback."
        );
        await connectWithUri(directMongoUri, "fallback");
        return;
      } catch (fallbackError) {
        console.error(
          "MongoDB Connection Failed (fallback):",
          fallbackError.message
        );
        process.exit(1);
      }
    } else if (isSrvDnsError(error.message)) {
      console.error(
        "MongoDB Connection Failed: DNS SRV lookup failed. Add MONGO_URI_DIRECT (mongodb://...) from Atlas 'Standard connection string' as a fallback, or verify your DNS/network access."
      );
    } else {
      console.error("MongoDB Connection Failed:", error.message);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
