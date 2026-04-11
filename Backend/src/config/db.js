const mongoose = require("mongoose");

const isSrvDnsError = (message = "") =>
  message.includes("querySrv ECONNREFUSED") ||
  message.includes("querySrv ENOTFOUND") ||
  message.includes("querySrv ETIMEOUT");

const connectWithUri = async (uri, label) => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 });
  console.log(`Connected DB (${label}):`, mongoose.connection.name);
};

const connectDB = async () => {
  const mongoUris = [
    process.env.MONGO_URI,
    process.env.MONGO_URI_DIRECT,
  ].filter(Boolean);

  if (mongoUris.length === 0) {
    console.error("MongoDB Connection Failed: set MONGO_URI or MONGO_URI_DIRECT in .env");
    process.exit(1);
  }

  let lastError;

  for (let index = 0; index < mongoUris.length; index += 1) {
    const uri = mongoUris[index];
    const label = index === 0 ? "primary" : "fallback";

    try {
      await connectWithUri(uri, label);
      return;
    } catch (error) {
      lastError = error;

      if (isSrvDnsError(error.message) && process.env.MONGO_URI_DIRECT) {
        console.warn(
          "MongoDB SRV DNS lookup failed. Retrying with MONGO_URI_DIRECT fallback."
        );
      }

      console.error(`MongoDB connect failed for ${label}:`, error.message);

      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect().catch(() => {});
      }
    }
  }

  if (isSrvDnsError(lastError?.message) && !process.env.MONGO_URI_DIRECT) {
    console.error(
      "MongoDB Connection Failed: DNS SRV lookup failed. Add MONGO_URI_DIRECT (mongodb://...) from Atlas 'Standard connection string' as a fallback, or verify your DNS/network access."
    );
  } else if (lastError?.message?.includes("querySrv ECONNREFUSED")) {
    console.error(
      "MongoDB Connection Failed: DNS SRV lookup was refused. Atlas DNS may be blocked. Using MONGO_URI_DIRECT (mongodb://127.0.0.1:27017/...) is recommended for local dev."
    );
  }

  process.exit(1);
};

module.exports = connectDB;
