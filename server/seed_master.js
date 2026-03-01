/**
 * Master Seed Script: Populates the database with realistic clubs, events, and complaints.
 * Run with: node seed_master.js
 */
const mongoose = require("mongoose");
require("dotenv").config();

const Club = require("./models/Club");
const Event = require("./models/Event");
const Complaint = require("./models/Complaint");
const User = require("./models/User");
const Announcement = require("./models/Announcement");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/astu_complaints");
  console.log("Connected to MongoDB");

  // Clear existing (optional - only for non-user data)
  await Club.deleteMany({});
  await Event.deleteMany({});
  await Complaint.deleteMany({});
  await Announcement.deleteMany({});

  const admin = await User.findOne({ email: "admin@astu.edu.et" });
  const student = await User.findOne({ role: "student" });
  
  if (!admin || !student) {
    console.error("Missing admin or student user. Run initial seeding first.");
    process.exit(1);
  }

  // 1. Seed Clubs
  const clubs = [
    { name: "ASTU Robotics Club", description: "Building robots and competing in national competitions", coordinator: "Dr. Tadesse M.", members_count: 45, status: "Active" },
    { name: "Coding Community", description: "Weekly coding challenges and hackathons", coordinator: "Hanna L.", members_count: 120, status: "Active" },
    { name: "Entrepreneurship Club", description: "Fostering startup culture among students", coordinator: "Yonas G.", members_count: 78, status: "Active" },
    { name: "Literary & Debate Society", description: "Debates and creative writing events", coordinator: "Meron T.", members_count: 52, status: "Inactive" },
  ];
  await Club.insertMany(clubs);
  console.log("Seeded Clubs");

  // 2. Seed Events
  const events = [
    { title: "Annual Science Fair", description: "Showcasing student projects", date: new Date("2026-03-20"), createdBy: admin._id },
    { title: "Hackathon 2026", description: "48-hour coding marathon", date: new Date("2026-04-05"), createdBy: admin._id },
    { title: "Career Day", description: "Meeting with top employers", date: new Date("2026-03-15"), createdBy: admin._id },
  ];
  await Event.insertMany(events);
  console.log("Seeded Events");

  // 3. Seed Announcements
  const announcements = [
    { title: "Exam Schedule Released", content: "Final exams starting May 1st.", createdBy: admin._id, tags: ["Academic", "Urgent"] },
    { title: "New Cafeteria Hours", content: "Open until 9 PM.", createdBy: admin._id, tags: ["Cafeteria", "Update"] },
  ];
  await Announcement.insertMany(announcements);
  console.log("Seeded Announcements");

  // 4. Seed Complaints (Realistic distribution)
  const departments = ["Dormitory", "Cafeteria", "Library", "Academic", "IT Services"];
  const statuses = ["pending", "in_progress", "resolved", "rejected"];
  
  const complaints = [];
  for (let i = 0; i < 30; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - Math.floor(Math.random() * 5)); // Past 5 months
    
    complaints.push({
      title: `Issue ${i+1} in ${dept}`,
      description: `Detailed description for complaint number ${i+1}.`,
      department: dept,
      status: status,
      student: student._id,
      createdAt: oldDate
    });
  }
  await Complaint.insertMany(complaints);
  console.log("Seeded 30 Complaints");

  console.log("Done Seeding.");
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
