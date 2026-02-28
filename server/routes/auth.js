const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const { extractNameAndIdFromImage } = require("../lib/ocr");

const router = express.Router();
const upload = multer();

// Student Register with OCR verification
router.post("/register", upload.single("idCard"), async (req, res) => {
  try {
    const {
      name,
      uid,
      email,
      password,
      department,
      role = "student",
    } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    if (!req.file)
      return res.status(400).json({ message: "ID card image required" });

    // OCR extraction
    const ocr = await extractNameAndIdFromImage(req.file.buffer);
    if (!ocr.id) {
      return res
        .status(400)
        .json({ message: "Could not extract ID from image" });
    }
    // Compare extracted id (ID: non-case sensitive and ignore all non-alphanumeric chars)
    const cleanId = (str) => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    
    const submittedIdClean = cleanId(uid);
    const extractedIdClean = cleanId(ocr.id);
    
    console.log("OCR Verification (ID Only):");
    console.log("  Submitted ID: ", uid, " -> ", submittedIdClean);
    console.log("  Extracted ID: ", ocr.id, " -> ", extractedIdClean);

    // Make ID check more lenient: check if one contains the other (ignoring slashes)
    const idMatches = extractedIdClean.includes(submittedIdClean) || submittedIdClean.includes(extractedIdClean);

    if (!idMatches) {
      console.log("  Match Failed! idMatches:", idMatches);
      return res
        .status(400)
        .json({ message: "ID does not match ID card" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role, department });
    await user.save();
    res.status(201).json({ message: "User registered and verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin creation endpoint (one-time use)
router.post("/create-admin", async (req, res) => {
  try {
    const email = "admin@astu.edu.et";
    const password = "Admin@1234";
    const name = "ASTU Admin";
    const role = "admin";
    const department = "Administration";
    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashed, role, department });
      await user.save();
    }
    res.json({ email, password });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Staff creation endpoint (one-time use)
router.post("/create-staff", async (req, res) => {
  try {
    const staffAccounts = [
      {
        name: "Meron Tadesse",
        email: "staff1@astu.edu.et",
        password: "Staff@1234",
        department: "Dormitory",
        role: "staff",
      },
      {
        name: "Samuel Bekele",
        email: "staff2@astu.edu.et",
        password: "Staff@5678",
        department: "Cafeteria",
        role: "staff",
      },
    ];
    const created = [];
    for (const staff of staffAccounts) {
      let user = await User.findOne({ email: staff.email });
      if (!user) {
        const hashed = await bcrypt.hash(staff.password, 10);
        user = new User({ ...staff, password: hashed });
        await user.save();
      }
      created.push({ email: staff.email, password: staff.password });
    }
    res.json({ staff: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
