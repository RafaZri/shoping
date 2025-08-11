import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Temporary in-memory storage for testing
let users = [];

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const addUser = (user) => {
  users.push(user);
  console.log('User added:', { id: user.id, email: user.email, firstName: user.firstName });
  return user;
};

export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (auto-verified for development)
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: true, // Auto-verified for development
      verifiedAt: new Date().toISOString(),
      searchHistory: [],
      savedProducts: []
    };

    // Store user (in production, save to database)
    addUser(newUser);

    // Return success (don't include password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { 
        message: 'Account created successfully! You can now sign in.',
        user: userWithoutPassword,
        emailSent: false
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 