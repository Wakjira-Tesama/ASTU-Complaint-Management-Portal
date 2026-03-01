// Load environment variables
require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Error logging for environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI is not defined in environment variables!");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not defined. Authentication will fail.");
}

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // Allow all in dev/production if not specified
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
console.log("⏳ Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error detail:");
    console.error("   Error Name:", err.name);
    console.error("   Error Message:", err.message);
    console.error("   Error Code:", err.code);
    if (err.message.includes("authentication failed")) {
      console.error("   👉 Tip: Double check your database password. Remember to use %40 for @.");
    }
    if (err.message.includes("ETIMEDOUT") || err.message.includes("whitelist")) {
      console.error("   👉 Tip: Check your MongoDB Atlas IP Whitelist (set to 0.0.0.0/0).");
    }
    process.exit(1);
  });

// Example route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Import routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/clubs", require("./routes/clubs"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/events", require("./routes/events"));
app.use("/api/users", require("./routes/users"));
app.use("/api/analytics", require("./routes/analytics"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
