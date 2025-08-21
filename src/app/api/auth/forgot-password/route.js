import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../../utils/emailServiceDev.js';

// In-memory user storage (replace with database in production)
let users = [];

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user with this email
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex === -1) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
        { status: 200 }
      );
    }

    const user = users[userIndex];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    users[userIndex] = {
      ...user,
      resetToken,
      resetExpiry: resetExpiry.toISOString()
    };

    // Send password reset email
    let emailResult = { success: false, error: 'Email not configured' };
    try {
      emailResult = await sendPasswordResetEmail(email, resetToken, user.firstName);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      emailResult = { success: false, error: emailError.message };
    }

    // Always return success message for security (don't reveal if email was sent)
    return NextResponse.json(
      { 
        message: 'If an account with that email exists, we\'ve sent a password reset link. Please check your email.'
      },
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