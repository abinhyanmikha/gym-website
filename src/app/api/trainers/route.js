// src/app/api/trainers/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/mongodb";
import Trainer from "@/models/Trainer";

export async function POST(req) {
  const { name, imageBase64 } = await req.json();

  if (!name || !imageBase64) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder: "nextjs-demo",
      resource_type: "auto",
    });

    // Connect to MongoDB
    await dbConnect();

    // Save trainer data in MongoDB
    const trainer = await Trainer.create({
      name,
      imageUrl: uploadResult.secure_url,
    });

    return NextResponse.json({ trainer }, { status: 201 });
  } catch (err) {
    console.error("Error uploading trainer:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const trainers = await Trainer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ trainers });
  } catch (err) {
    console.error("Error fetching trainers:", err);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 }
    );
  }
}
