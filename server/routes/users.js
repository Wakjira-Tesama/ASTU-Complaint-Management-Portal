const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all staff with their complaint stats (Admin only)
router.get("/staff", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const staffUsers = await User.find({ role: "staff" }).select("-password");
    
    // Get complaint statistics for each department
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: { department: "$department", status: "$status" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Map stats to an easier to use format
    const staffWithStats = staffUsers.map(user => {
      const userObj = user.toObject();
      const deptStats = stats.filter(s => s._id.department === user.department);
      
      const resolved = deptStats.find(s => s._id.status === "resolved")?.count || 0;
      const pending = deptStats.find(s => s._id.status === "pending")?.count || 0;
      
      return {
        ...userObj,
        id: userObj._id,
        resolved,
        pending
      };
    });

    res.json(staffWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new staff (Admin only)
router.post("/staff", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, email, password, department } = req.body;
    
    // Enforce one staff per department
    const existingStaffForDept = await User.findOne({ role: "staff", department });
    if (existingStaffForDept) {
      return res.status(400).json({ message: `A staff member for the ${department} department already exists` });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
      role: "staff",
      department
    });
    
    await user.save();
    res.status(201).json({ message: "Staff account created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
