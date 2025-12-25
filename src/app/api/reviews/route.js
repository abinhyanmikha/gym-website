import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

// GET: list all reviews
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ _id: -1 });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: create a new review
export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();

    const review = await Review.create(body);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
