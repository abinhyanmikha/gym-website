// src/app/api/subscriptions/route.js
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export async function GET(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit')) || 100;
    const page = parseInt(searchParams.get('page')) || 1;

    await connectDB();

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { features: { $elemMatch: { $regex: search, $options: 'i' } } }
        ]
      };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch subscription plans with sorting, search, and pagination
    const plans = await Subscription.find(query)
      .sort(sortObj)
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalPlans = await Subscription.countDocuments(query);
    const totalPages = Math.ceil(totalPlans / limit);

    return NextResponse.json({
      plans,
      pagination: {
        currentPage: page,
        totalPages,
        totalPlans,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
