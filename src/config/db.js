const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MongoDB Connection Failed: MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.error(
        "MongoDB Connection Failed: DNS SRV lookup was refused. If you are using Atlas, re-copy the full URI from Atlas > Connect > Drivers and verify your network/DNS access."
      );
    } else {
      console.error("MongoDB Connection Failed:", error.message);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
