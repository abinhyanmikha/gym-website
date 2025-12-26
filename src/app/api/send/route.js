// src/app/api/send/route.js
import { NextResponse } from "next/server";
import { sendEmail } from "../../../lib/email";

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

    const result = await sendEmail({
      to: email,
      subject: "Hello from Ajima Physical Fitness",
      html: "<p>Hello!</p>",
    });

    if (!result?.success) {
      return NextResponse.json(
        { message: "Error sending email", error: result?.error || "Failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Email sent!", info: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error sending email", error: err.message },
      { status: 500 }
    );
  }
}
