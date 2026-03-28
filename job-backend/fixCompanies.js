const mongoose = require("mongoose");
require("dotenv").config(); // Make sure you have MONGO_URI in your .env

const Job = require("./models/Job");
const Application = require("./models/Application");
const Interview = require("./models/Interview");
const Company = require("./models/Company");

async function fixCompanies() {
  try {
    // ✅ Mongoose v7+ default options, no need for useNewUrlParser/useUnifiedTopology
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1️⃣ Pick a default company to assign where missing
    const defaultCompany = await Company.findOne();
    if (!defaultCompany) throw new Error("No companies found in database");
    console.log("Using default company:", defaultCompany.companyName);

    // 2️⃣ Fix Jobs without a company
    const jobsUpdated = await Job.updateMany(
      { company: { $exists: false } },
      { $set: { company: defaultCompany._id } }
    );
    console.log(`Jobs updated: ${jobsUpdated.modifiedCount}`);

    // 3️⃣ Fix Applications missing company
    const apps = await Application.find({});
    let appFixCount = 0;
    for (const app of apps) {
      if (!app.company) {
        const job = await Job.findById(app.jobId);
        if (job && job.company) {
          app.company = job.company;
        } else {
          app.company = defaultCompany._id;
        }
        await app.save();
        appFixCount++;
      }
    }
    console.log(`Applications fixed: ${appFixCount}`);

    // 4️⃣ Fix Interviews missing company
    const interviews = await Interview.find({});
    let intFixCount = 0;
    for (const intv of interviews) {
      if (!intv.company) {
        const app = await Application.findById(intv.applicationId);
        if (app && app.company) {
          intv.company = app.company;
        } else {
          intv.company = defaultCompany._id;
        }
        await intv.save();
        intFixCount++;
      }
    }
    console.log(`Interviews fixed: ${intFixCount}`);

    console.log("✅ All missing companies fixed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

fixCompanies();