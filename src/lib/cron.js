// Cron job utility for subscription expiration checks
// This can be used with services like Vercel Cron Jobs or node-cron

export async function checkSubscriptionExpirations() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/subscriptions/check-expiration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Subscription expiration check completed:', result);
    return result;
  } catch (error) {
    console.error('Failed to check subscription expirations:', error);
    throw error;
  }
}

// For use with node-cron (if you want to run this locally)
// Uncomment the following lines and install node-cron: npm install node-cron
/*
import cron from 'node-cron';

// Run daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running subscription expiration check...');
  try {
    await checkSubscriptionExpirations();
  } catch (error) {
    console.error('Cron job failed:', error);
  }
});
*/

// For Vercel Cron Jobs, create a file at /pages/api/cron/check-subscriptions.js:
/*
import { checkSubscriptionExpirations } from '@/lib/cron';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const result = await checkSubscriptionExpirations();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check subscriptions' });
  }
}
*/