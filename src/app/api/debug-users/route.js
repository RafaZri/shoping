import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return the global users array for debugging
    const users = global.users || [];
    
    // Only return safe user data (no passwords)
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      searchHistory: user.searchHistory || [],
      savedProducts: user.savedProducts || [],
      createdAt: user.createdAt
    }));
    
    return NextResponse.json({
      totalUsers: users.length,
      users: safeUsers
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


