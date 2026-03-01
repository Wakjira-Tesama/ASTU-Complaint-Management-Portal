const express = require("express");
const Club = require("../models/Club");
const router = express.Router();

// Get all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create club (admin)
router.post("/", async (req, res) => {
  try {
    const { name, description, coordinator, status } = req.body;
    const club = new Club({ name, description, coordinator, status });
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update club status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const club = await Club.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete club
router.delete("/:id", async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
