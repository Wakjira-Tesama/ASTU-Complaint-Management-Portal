/**
 * Seed script: creates department admin/staff accounts in MongoDB.
 * Run with: node seed_departments.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "staff", "admin"], required: true },
  department: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const departments = [
  { name: "Dormitory Admin",                    email: "dormitory@astu.edu",       dept: "Dormitory" },
  { name: "Cafeteria Admin",                    email: "cafeteria@astu.edu",        dept: "Cafeteria" },
  { name: "Library Admin",                      email: "library@astu.edu",          dept: "Library" },
  { name: "Sports Office Admin",                email: "sports@astu.edu",           dept: "Sports Office" },
  { name: "Health Center Admin",                email: "health@astu.edu",           dept: "Health Center" },
  { name: "IT Services Admin",                  email: "it@astu.edu",              dept: "IT Services" },
  { name: "Transportation Admin",               email: "transport@astu.edu",        dept: "Transportation" },
  { name: "EEC Admin",                          email: "eec@astu.edu",              dept: "Electrical Engineering & Computing" },
  { name: "MCME Admin",                         email: "mcme@astu.edu",             dept: "Mechanical, Chemical & Materials Eng." },
  { name: "Civil Engineering Admin",            email: "civil@astu.edu",            dept: "Civil Engineering and Architecture" },
  { name: "Applied Natural Science Admin",      email: "ans@astu.edu",              dept: "Applied Natural Science" },
];

const PASSWORD = "Admin@1234";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/astu_complaints");
  console.log("Connected to MongoDB");

  const hashedPwd = await bcrypt.hash(PASSWORD, 10);
  let created = 0, skipped = 0;

  for (const dept of departments) {
    const exists = await User.findOne({ email: dept.email });
    if (exists) {
      console.log(`  SKIP (already exists): ${dept.email}`);
      skipped++;
      continue;
    }
    await User.create({
      name: dept.name,
      email: dept.email,
      password: hashedPwd,
      role: "staff",
      department: dept.dept,
    });
    console.log(`  CREATED: ${dept.email}  [${dept.dept}]`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  console.log(`\nAll accounts use password: ${PASSWORD}`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
