// lib/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested a password reset for your gym account. Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p><strong>This link will expire in 1 hour.</strong></p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        This email was sent from your Gym Management System
      </p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Password Reset Request - Gym Management System",
    html
  });
}

export async function sendSubscriptionPurchaseEmail(email, subscriptionDetails) {
  const { subscriptionName, amount, startDate, endDate, transactionId } = subscriptionDetails;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #4CAF50; text-align: center;">🎉 Subscription Activated!</h2>
      <p>Hello,</p>
      <p>Thank you for your purchase! Your gym subscription has been successfully activated.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
        <p><strong>Plan:</strong> ${subscriptionName}</p>
        <p><strong>Amount Paid:</strong> Rs. ${amount}</p>
        <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
      </div>
      
      <p>You can now access all the features included in your subscription plan. Visit your dashboard to get started!</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        This email was sent from your Gym Management System
      </p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Subscription Activated - Gym Management System",
    html
  });
}

export async function sendSubscriptionExpirationEmail(email, subscriptionDetails) {
  const { subscriptionName, endDate, userName } = subscriptionDetails;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #ff6b35; text-align: center;">⚠️ Subscription Expiring Soon</h2>
      <p>Hello ${userName || 'Valued Member'},</p>
      <p>Your gym subscription is expiring soon. Don't miss out on your fitness journey!</p>
      
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
        <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
        <p><strong>Plan:</strong> ${subscriptionName}</p>
        <p><strong>Expiration Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
      </div>
      
      <p>To continue enjoying uninterrupted access to our gym facilities, please renew your subscription before it expires.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/membership-plans" 
           style="background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Renew Subscription
        </a>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        This email was sent from your Gym Management System
      </p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Subscription Expiring Soon - Gym Management System",
    html
  });
}

export async function sendSubscriptionExpiredEmail(email, subscriptionDetails) {
  const { subscriptionName, endDate, userName } = subscriptionDetails;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #dc3545; text-align: center;">❌ Subscription Expired</h2>
      <p>Hello ${userName || 'Valued Member'},</p>
      <p>Your gym subscription has expired. We hope you enjoyed your time with us!</p>
      
      <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
        <h3 style="color: #333; margin-top: 0;">Expired Subscription:</h3>
        <p><strong>Plan:</strong> ${subscriptionName}</p>
        <p><strong>Expired On:</strong> ${new Date(endDate).toLocaleDateString()}</p>
      </div>
      
      <p>To regain access to our gym facilities and continue your fitness journey, please purchase a new subscription.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/membership-plans" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Purchase New Subscription
        </a>
      </div>
      
      <p>Thank you for being part of our gym community. We look forward to welcoming you back!</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        This email was sent from your Gym Management System
      </p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Subscription Expired - Gym Management System",
    html
  });
}
