const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Get complaints (filtered by role)
router.get("/", auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    let query = {};

    if (role === "student") {
      // Students see only their own complaints
      query = { student: id };
    } else if (role === "staff") {
      // Need to fetch staff department to filter complaints
      const staffUser = await User.findById(id);
      if (!staffUser || !staffUser.department) {
        return res.status(400).json({ message: "Staff department not found" });
      }
      query = { department: staffUser.department };
    }
    // Admins see all complaints (query remains {})

    const complaints = await Complaint.find(query).populate("student", "name email");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create complaint (student only usually, but let's allow any authenticated user)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, department } = req.body;
    // req.user.id is used directly as the student instead of trusting the request body
    const complaint = new Complaint({
      title,
      description,
      department,
      student: req.user.id,
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update complaint status (staff/admin)
router.patch("/:id", auth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "student") {
      return res.status(403).json({ message: "Students cannot update status" });
    }

    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true },
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
