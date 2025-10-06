import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  console.log("✅ /api/login HIT"); // debug log
  try {
    const { email, password } = await req.json();
    console.log("Login attempt:", email);

    // Connect to MongoDB
    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    
    return NextResponse.json(
      {
        message: "Login successful",
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
