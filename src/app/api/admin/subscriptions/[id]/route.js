import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// PUT handler to update a subscription
export async function PUT(request, { params }) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const subscriptionData = await request.json();
    
    // Connect to MongoDB
    await connectDB();
    
    // Find subscription and update
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      { $set: subscriptionData },
      { new: true }
    );
    
    if (!updatedSubscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

// DELETE handler to delete a subscription
export async function DELETE(request, { params }) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Connect to MongoDB
    await connectDB();
    
    // Find subscription and delete
    const deletedSubscription = await Subscription.findByIdAndDelete(id);
    
    if (!deletedSubscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}