const express = require("express");
const Announcement = require("../models/Announcement");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all announcements
router.get("/", auth, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 }); // sort by newest first
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create announcement (admin/staff)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role === "student") {
      return res.status(403).json({ message: "Students cannot post announcements" });
    }

    const { title, content } = req.body;
    const announcement = new Announcement({ 
      title, 
      content, 
      createdBy: req.user.id 
    });
    
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
