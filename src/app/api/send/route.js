// src/app/api/send/route.js
import { NextResponse } from "next/server";
import { sendHelloEmail } from "../../../lib/email";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const info = await sendHelloEmail(email);
    return NextResponse.json({ message: "Email sent!", info });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error sending email", error: err.message },
      { status: 500 }
    );
  }
}
