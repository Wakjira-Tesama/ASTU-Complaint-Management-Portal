const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Get overall stats for Admin Dashboard
router.get("/admin", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const totalComplaints = await Complaint.countDocuments();
    const activeStaff = await User.countDocuments({ role: "staff" });
    const resolvedCount = await Complaint.countDocuments({ status: "resolved" });
    const pendingCount = await Complaint.countDocuments({ status: "pending" });
    
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

    // Complaints by Department
    const deptStats = await Complaint.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $project: { name: "$_id", complaints: "$count", _id: 0 } }
    ]);

    // Status Distribution
    const statusStats = await Complaint.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // Monthly Trend (Last 6 months)
    const monthlyStats = await Complaint.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthly = monthlyStats.map(s => ({
      month: months[s._id.month - 1],
      complaints: s.count
    })).reverse();

    res.json({
      summary: [
        { label: "Total Complaints", value: totalComplaints.toString(), icon: "MessageSquare", color: "text-info" },
        { label: "Active Staff", value: activeStaff.toString(), icon: "Users", color: "text-accent" },
        { label: "Resolution Rate", value: `${resolutionRate}%`, icon: "TrendingUp", color: "text-success" },
        { label: "Pending Now", value: pendingCount.toString(), icon: "AlertTriangle", color: "text-destructive" },
      ],
      deptData: deptStats,
      statusData: statusStats,
      monthlyData: formattedMonthly
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get stats for Staff Dashboard (department specific)
router.get("/staff", auth, async (req, res) => {
  try {
    if (req.user.role === "student") {
      return res.status(403).json({ message: "Staff/Admin access required" });
    }

    const staffUser = await User.findById(req.user.id);
    const department = staffUser.department;

    if (!department) return res.status(400).json({ message: "No department assigned" });

    const total = await Complaint.countDocuments({ department });
    const pending = await Complaint.countDocuments({ department, status: "pending" });
    const resolved = await Complaint.countDocuments({ department, status: "resolved" });
    const rejected = await Complaint.countDocuments({ department, status: "rejected" });

    res.json({
      department,
      summary: [
        { label: "Assigned Tickets", value: total.toString(), icon: "MessageSquare", color: "text-info" },
        { label: "Pending Review", value: pending.toString(), icon: "Clock", color: "text-warning" },
        { label: "Resolved", value: resolved.toString(), icon: "CheckCircle2", color: "text-success" },
        { label: "Rejected", value: rejected.toString(), icon: "AlertCircle", color: "text-destructive" },
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
