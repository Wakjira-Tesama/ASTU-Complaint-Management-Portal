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
    const { name, description } = req.body;
    const club = new Club({ name, description });
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
