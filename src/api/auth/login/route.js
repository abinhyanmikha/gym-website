import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "Login successful", user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
