/**
 * Update script: gives realistic names to department staff accounts.
 */
const mongoose = require("mongoose");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String },
  department: { type: String },
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const realisticNames = {
  "dormitory@astu.edu": "Meron Tadesse",
  "cafeteria@astu.edu": "Yonas Girma",
  "library@astu.edu": "Biniam Kebede",
  "sports@astu.edu": "Selam Desta",
  "health@astu.edu": "Hanna Lemma",
  "it@astu.edu": "Tewodros Assefa",
  "transport@astu.edu": "Abebe Kasahun",
  "eec@astu.edu": "Almaz Ayana",
  "mcme@astu.edu": "Mulugeta Seraw",
  "civil@astu.edu": "Genet Belay",
  "ans@astu.edu": "Dereje Tilahun",
};

async function update() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/astu_complaints");
  console.log("Connected to MongoDB");

  for (const [email, name] of Object.entries(realisticNames)) {
    const res = await User.updateOne({ email }, { name });
    if (res.modifiedCount > 0) {
      console.log(`  UPDATED: ${email} -> ${name}`);
    } else {
      console.log(`  SKIPPED: ${email} (No change or not found)`);
    }
  }

  console.log("\nDone updating names.");
  process.exit(0);
}

update().catch((e) => { console.error(e); process.exit(1); });
