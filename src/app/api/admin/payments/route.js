import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '../../../../lib/mongodb';
import Payment from '../../../../models/Payment';
import Subscription from '../../../../models/Subscription';
import mongoose from 'mongoose';

// GET handler to list all payments with optional sorting and search
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
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit')) || 100;
    const page = parseInt(searchParams.get('page')) || 1;

    // Connect to MongoDB
    await connectDB();

    // Build search query
    let query = {};
    if (search) {
      query.$or = [
        { subscriptionName: { $regex: search, $options: 'i' } },
        { refId: { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch payments with sorting, search, and pagination
    const payments = await Payment.find(query)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .populate('userId', 'name email')
      .lean();

    const subscriptionIds = payments
      .map((payment) => payment.subscriptionId)
      .filter((id) => mongoose.isValidObjectId(id));

    const subscriptions = subscriptionIds.length
      ? await Subscription.find({ _id: { $in: subscriptionIds } }).lean()
      : [];

    const subscriptionById = new Map(
      subscriptions.map((subscription) => [
        subscription._id.toString(),
        subscription,
      ])
    );

    const enrichedPayments = payments.map((payment) => {
      const plan = subscriptionById.get(payment.subscriptionId) || null;
      const user = payment.userId
        ? {
            id: payment.userId._id?.toString?.() || payment.userId._id,
            name: payment.userId.name,
            email: payment.userId.email,
          }
        : null;

      return {
        _id: payment._id?.toString?.() || payment._id,
        refId: payment.refId,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt,
        subscriptionId: payment.subscriptionId,
        subscriptionName: payment.subscriptionName,
        user,
        plan: plan
          ? {
              id: plan._id.toString(),
              name: plan.name,
              price: plan.price,
              duration: plan.duration,
              includesCardio: plan.includesCardio,
              features: plan.features,
            }
          : null,
      };
    });

    // Get total count for pagination
    const totalPayments = await Payment.countDocuments(query);
    const totalPages = Math.ceil(totalPayments / limit);
    
    return NextResponse.json({
      payments: enrichedPayments,
      pagination: {
        currentPage: page,
        totalPages,
        totalPayments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
