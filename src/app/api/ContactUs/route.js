import { connectDB } from "@/lib/mongodb";
import ContactUs from "@/models/ContactUs";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    await connectDB();
    const newContact = new ContactUs({ name, email, message });
    await newContact.save();
    return NextResponse.json(
      { message: "Contact form submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
