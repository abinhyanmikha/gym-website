import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();
    const fileStr = body.data; // base64 encoded image string

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "nextjs-demo", // optional folder name in Cloudinary
    });

    return NextResponse.json({ url: uploadedResponse.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
