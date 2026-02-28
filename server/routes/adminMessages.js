const express = require("express");
const AdminMessage = require("../models/AdminMessage");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Get messages for a specific department
router.get("/:department", auth, async (req, res) => {
  try {
    let { role, department, id } = req.user;
    const targetDept = req.params.department;

    if (!department && role === "staff") {
      const user = await User.findById(id);
      if (user) department = user.department;
    }

    // Admin can see any department's messages
    // Staff can only see their own department's messages
    if (role === "staff" && String(department) !== String(targetDept)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await AdminMessage.find({ department: targetDept }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a message to/from a department
router.post("/:department", auth, async (req, res) => {
  try {
    const { text } = req.body;
    let { id, role, department } = req.user;
    const targetDept = req.params.department;

    if (role === "student") {
      return res.status(403).json({ message: "Students cannot participate in admin-staff messages" });
    }

    if (!department && role === "staff") {
      const user = await User.findById(id);
      if (user) department = user.department;
    }

    if (role === "staff" && String(department) !== String(targetDept)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const message = new AdminMessage({
      department: targetDept,
      senderRole: role,
      senderName: user.name,
      text,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
