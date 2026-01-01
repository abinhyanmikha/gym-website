import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/mongodb.js";
import User from "../src/models/User.js";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    await connectDB();
    const email = "admin_verifier@test.com";
    const password = "password";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let user = await User.findOne({ email });
    if (user) {
      user.role = "admin";
      user.password = hashedPassword;
      await user.save();
      console.log("Updated existing user to admin");
    } else {
      user = await User.create({
        name: "Admin Verifier",
        email,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Created new admin user");
    }
    console.log(`Credentials: ${email} / ${password}`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
