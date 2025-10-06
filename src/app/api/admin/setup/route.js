import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    
    // Connect to MongoDB
    await connectDB();
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      existingUser.role = 'admin';
      await existingUser.save();
      
      return NextResponse.json(
        { message: `User ${email} updated to admin role` },
        { status: 200 }
      );
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    return NextResponse.json(
      { message: `Admin user ${email} created successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}