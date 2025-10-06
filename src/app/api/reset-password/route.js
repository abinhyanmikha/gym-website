import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ email: resetRecord.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    });

    // Mark the reset token as used
    await PasswordReset.findByIdAndUpdate(resetRecord._id, {
      used: true
    });

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}