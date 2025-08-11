import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../utils/emailServiceDev';

// In-memory user storage (replace with database in production)
let users = [];

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
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: false,
      verificationToken,
      verificationExpiry: verificationExpiry.toISOString(),
      searchHistory: [],
      savedProducts: []
    };

    // Store user (in production, save to database)
    users.push(newUser);

    // Send verification email (optional - won't fail signup if email fails)
    let emailResult = { success: false, error: 'Email not configured' };
    try {
      emailResult = await sendVerificationEmail(email, verificationToken, firstName);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      emailResult = { success: false, error: emailError.message };
    }

    // Return success (don't include password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { 
        message: emailResult.success 
          ? 'Account created successfully! Please check your email to verify your account.'
          : 'Account created successfully! Please check your email to verify your account. (Email service not configured)',
        user: userWithoutPassword,
        emailSent: emailResult.success
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