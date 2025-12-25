import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

// GET handler to list all users with optional sorting and search
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

    // Connect to MongoDB
    await connectDB();

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch users with sorting, search, and pagination
    const users = await User.find(query, { password: 0 })
      .sort(sortObj)
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST handler to create a new user
export async function POST(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await request.json();
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }
    
    // Create new user
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Note: In a real app, hash this password
      role: userData.role || 'user',
      createdAt: new Date()
    });
    
    await newUser.save();
    
    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}