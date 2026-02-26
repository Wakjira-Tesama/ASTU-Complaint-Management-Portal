require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
