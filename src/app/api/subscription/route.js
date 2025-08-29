import dbConnect from "../../../lib/mongodb";
import Subscription from "../../../models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const plans = await Subscription.find({});
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
