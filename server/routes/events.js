const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create event (staff/admin)
router.post("/", async (req, res) => {
  try {
    const { title, description, date, createdBy } = req.body;
    const event = new Event({ title, description, date, createdBy });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
