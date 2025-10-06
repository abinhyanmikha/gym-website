import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log("Registration attempt:", { name, email });

    if (!name || !email || !password) {
      console.log("Registration failed: Missing fields");
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Registration failed: User already exists");
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role: "user" // Ensure role is set
    });
    
    console.log("User registered successfully:", newUser._id);
    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
