import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function PUT(request) {
  try {
    const { firstName, lastName } = await request.json();
    
    // Get the token from cookies
    const cookieHeader = request.headers.get('cookie');
    const cookies = cookieHeader ? Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        return [name, value];
      })
    ) : {};
    
    const token = cookies['auth-token'];
    
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Find the user in the global users array
    const userIndex = global.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update the user's name
    global.users[userIndex].firstName = firstName;
    global.users[userIndex].lastName = lastName;

    // Create a new token with updated user info
    const newToken = jwt.sign(
      { 
        userId: global.users[userIndex].id,
        email: global.users[userIndex].email,
        firstName: global.users[userIndex].firstName,
        lastName: global.users[userIndex].lastName
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response with updated user data
    const response = NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: global.users[userIndex].id,
        email: global.users[userIndex].email,
        firstName: global.users[userIndex].firstName,
        lastName: global.users[userIndex].lastName,
        createdAt: global.users[userIndex].createdAt,
        searchHistory: global.users[userIndex].searchHistory || [],
        savedProducts: global.users[userIndex].savedProducts || []
      }
    });

    // Set the new token in cookies
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
