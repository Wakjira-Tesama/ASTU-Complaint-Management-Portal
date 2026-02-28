const express = require("express");
const Ticket = require("../models/Ticket");
const router = express.Router();

// Get all tickets (staff/admin)
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().populate(
      "createdBy assignedTo",
      "name email",
    );
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create ticket (student/staff)
router.post("/", async (req, res) => {
  try {
    const { title, description, createdBy, assignedTo } = req.body;
    const ticket = new Ticket({ title, description, createdBy, assignedTo });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update ticket status (staff/admin)
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true },
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
