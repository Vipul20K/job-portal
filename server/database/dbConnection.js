import mongoose from "mongoose"; //just mongoose import!

// Database connection here. Do nothing if DB_URL is not provided so the
// server can start (useful for local CORS/debugging without DB).
const dbConnection = async () => {
   const uri = process.env.DB_URL;
   if (!uri) {
      console.warn("DB_URL is not set. Skipping MongoDB connection (useful for local dev without DB).");
      return;
   }

   try {
      await mongoose.connect(uri, { dbName: "Job_Portal" });
      console.log("MongoDB Connected Successfully!");
   } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
   }
};

export default dbConnection;