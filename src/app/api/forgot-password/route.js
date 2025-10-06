import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { hashToken } from '@/lib/auth';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Delete any existing reset tokens for this email
    await PasswordReset.deleteMany({ email: email.toLowerCase() });

    // Create new reset token
    await PasswordReset.create({
      email: email.toLowerCase(),
      token: resetToken,
    });

    // Send reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}