import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// In-memory user storage (replace with database in production)
let users = [];

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Find user with this reset token
    const userIndex = users.findIndex(u => u.resetToken === token);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    const user = users[userIndex];

    // Check if token has expired
    if (new Date() > new Date(user.resetExpiry)) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user with new password and clear reset token
    users[userIndex] = {
      ...user,
      password: hashedPassword,
      resetToken: null,
      resetExpiry: null
    };

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 