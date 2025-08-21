import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Global in-memory storage (shared across all routes)
global.users = global.users || [];

const findUserById = (id) => {
  return global.users.find(user => user.id === id);
};

// JWT secret (required environment variable)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function GET(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = findUserById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize searchHistory and savedProducts if they don't exist (for existing users)
    if (!user.searchHistory) {
      user.searchHistory = [];
    }
    if (!user.savedProducts) {
      user.savedProducts = [];
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Auth check error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 