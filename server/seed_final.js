/**
 * Final Seed Script: Creates REAL accounts for all roles and populates all data.
 * Run with: node seed_final.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Models
const User = require("./models/User");
const Club = require("./models/Club");
const Event = require("./models/Event");
const Complaint = require("./models/Complaint");
const Announcement = require("./models/Announcement");

const PASS = "Staff@1234";
const STUDENT_PASS = "Student@1234";
const ADMIN_PASS = "Admin@1234";

const departments = [
  { name: "Meron Tadesse",      email: "dormitory@astu.edu",      dept: "Dormitory" },
  { name: "Yonas Girma",        email: "cafeteria@astu.edu",      dept: "Cafeteria" },
  { name: "Biniam Kebede",      email: "library@astu.edu",        dept: "Library" },
  { name: "Selam Desta",        email: "sports@astu.edu",         dept: "Sports Office" },
  { name: "Hanna Lemma",        email: "health@astu.edu",         dept: "Health Center" },
  { name: "Tewodros Assefa",    email: "it@astu.edu",             dept: "IT Services" },
  { name: "Abebe Kasahun",      email: "transport@astu.edu",      dept: "Transportation" },
  { name: "Almaz Ayana",        email: "eec@astu.edu",            dept: "Electrical Engineering & Computing" },
  { name: "Mulugeta Seraw",     email: "mcme@astu.edu",           dept: "Mechanical, Chemical & Materials Eng." },
  { name: "Genet Belay",        email: "civil@astu.edu",          dept: "Civil Engineering and Architecture" },
  { name: "Dereje Tilahun",     email: "ans@astu.edu",            dept: "Applied Natural Science" },
  { name: "Aster Kassa",        email: "freshman@astu.edu",       dept: "Division of Freshman Program" },
  { name: "Kidus Yohannes",     email: "continuing@astu.edu",     dept: "Continuing Educations" },
  { name: "Hiwot Tesfaye",      email: "postgrad@astu.edu",       dept: "Postgraduate Programs" },
  { name: "Samuel Hailu",       email: "other@astu.edu",          dept: "Other Services" },
];

const students = [
  { name: "Abebe Kebede",   email: "abebe@astu.edu",    id: "ASTU/23/0456" },
  { name: "Tigist Mamo",    email: "tigist@astu.edu",   id: "ASTU/22/0321" },
  { name: "Dawit Alemu",    email: "dawit@astu.edu",    id: "ASTU/24/0789" },
  { name: "Sara Belay",     email: "sara@astu.edu",     id: "ASTU/23/0654" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/astu_complaints");
  console.log("Connected to MongoDB");

  // Clear ALL data
  await User.deleteMany({});
  await Club.deleteMany({});
  await Event.deleteMany({});
  await Complaint.deleteMany({});
  await Announcement.deleteMany({});
  console.log("Cleared database");

  const staffHashed = await bcrypt.hash(PASS, 10);
  const studentHashed = await bcrypt.hash(STUDENT_PASS, 10);
  const adminHashed = await bcrypt.hash(ADMIN_PASS, 10);

  // 1. Create Admin
  const adminUser = await User.create({
    name: "System Administrator",
    email: "admin@astu.edu.et",
    password: adminHashed,
    role: "admin"
  });
  console.log("Created Admin: admin@astu.edu.et / Admin@1234");

  // 2. Create Staff
  const staffObjects = await User.insertMany(departments.map(d => ({
    name: d.name,
    email: d.email,
    password: staffHashed,
    role: "staff",
    department: d.dept
  })));
  console.log(`Created ${departments.length} Staff accounts (Password: Staff@1234)`);

  // 3. Create Students
  const studentObjects = await User.insertMany(students.map(s => ({
    name: s.name,
    email: s.email,
    password: studentHashed,
    role: "student"
  })));
  console.log(`Created ${students.length} Student accounts (Password: Student@1234)`);

  // 4. Seed Clubs
  const clubs = [
    { name: "ASTU Robotics Club", description: "Building robots and competing in national competitions", coordinator: "Dr. Tadesse M.", members_count: 45, status: "Active" },
    { name: "Coding Community", description: "Weekly coding challenges and hackathons", coordinator: "Hanna L.", members_count: 120, status: "Active" },
    { name: "Entrepreneurship Club", description: "Fostering startup culture among students", coordinator: "Yonas G.", members_count: 78, status: "Active" },
    { name: "Literary & Debate Society", description: "Debates and creative writing events", coordinator: "Meron T.", members_count: 52, status: "Inactive" },
  ];
  await Club.insertMany(clubs);

  // 5. Seed Events
  const events = [
    { title: "Annual Science Fair", description: "Showcasing student projects", date: new Date("2026-03-20"), createdBy: adminUser._id },
    { title: "Hackathon 2026", description: "48-hour coding marathon", date: new Date("2026-04-05"), createdBy: adminUser._id },
    { title: "Career Day", description: "Meeting with top employers", date: new Date("2026-03-15"), createdBy: adminUser._id },
  ];
  await Event.insertMany(events);

  // 6. Seed Announcements
  const announcements = [
    { title: "Exam Schedule Released", content: "Final exams starting May 1st.", createdBy: adminUser._id, tags: ["Academic", "Urgent"] },
    { title: "New Cafeteria Hours", content: "Open until 9 PM.", createdBy: adminUser._id, tags: ["Cafeteria", "Update"] },
    { title: "Water Shortage in Block 3", content: "Maintenance ongoing.", createdBy: staffObjects[0]._id, tags: ["Dormitory", "Alert"] },
  ];
  await Announcement.insertMany(announcements);

  // 7. Seed Complaints
  const depts = departments.map(d => d.dept);
  const statuses = ["pending", "in_progress", "resolved", "rejected"];
  
  const complaintData = [];
  for (let i = 0; i < 40; i++) {
    const dept = depts[Math.floor(Math.random() * depts.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const stud = studentObjects[Math.floor(Math.random() * studentObjects.length)];
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 4));

    const complaint = {
      title: `Issue ${i+1} in ${dept}`,
      description: `Detailed report for ${dept} regarding service quality or maintenance.`,
      department: dept,
      status: status,
      student: stud._id,
      createdAt: date,
      messages: []
    };

    // Add some random messages for in_progress/resolved
    if (status !== "pending") {
      complaint.messages.push({
        sender: "staff",
        senderName: "Staff Member",
        text: "We have received your report and are looking into it.",
        createdAt: date
      });
      if (Math.random() > 0.5) {
        complaint.messages.push({
          sender: "student",
          senderName: stud.name,
          text: "Thank you for the update. Any estimate on resolution?",
          createdAt: new Date(date.getTime() + 3600000)
        });
      }
    }
    complaintData.push(complaint);
  }
  await Complaint.insertMany(complaintData);
  console.log("Seeded 40 Complaints with conversation snippets.");

  console.log("Final Seeding Complete.");
  console.log("ADIMN: admin@astu.edu.et / Admin@1234");
  console.log("STAFF: cafeteria@astu.edu / Staff@1234");
  console.log("STUDENT: abebe@astu.edu / Student@1234");
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
