import { NextResponse } from 'next/server';

// In-memory user storage (replace with database in production)
let users = [];

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const userIndex = users.findIndex(user => user.verificationToken === token);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    const user = users[userIndex];

    // Check if token has expired
    if (new Date() > new Date(user.verificationExpiry)) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Mark user as verified
    users[userIndex] = {
      ...user,
      isVerified: true,
      verificationToken: null,
      verificationExpiry: null,
      verifiedAt: new Date().toISOString()
    };

    // Return success (don't include password)
    const { password: _, ...userWithoutPassword } = users[userIndex];
    
    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now sign in to your account.',
        user: userWithoutPassword
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 