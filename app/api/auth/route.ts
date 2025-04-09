import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { apiKey, databaseId } = await request.json();

    // Validate inputs
    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { success: false, error: 'API key and database ID are required' },
        { status: 400 }
      );
    }

    // Validate database ID format
    const isValidDatabaseId = /^[0-9a-f]{32}$/.test(databaseId);
    if (!isValidDatabaseId) {
      return NextResponse.json(
        { success: false, error: 'Invalid database ID format' },
        { status: 400 }
      );
    }

    // Set HTTP-only cookies
    const response = NextResponse.json({ success: true });
    
    // Set API key cookie (1 year expiry)
    response.cookies.set('notion_api_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });

    // Set database ID cookie (1 year expiry)
    response.cookies.set('notion_database_id', databaseId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });

    return response;
  } catch (error) {
    console.error('Error storing credentials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to store credentials' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('notion_api_key')?.value;
    const databaseId = cookieStore.get('notion_database_id')?.value;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { success: false, error: 'No credentials found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, databaseId });
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve credentials' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear the cookies
    response.cookies.delete('notion_api_key');
    response.cookies.delete('notion_database_id');

    return response;
  } catch (error) {
    console.error('Error clearing credentials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear credentials' },
      { status: 500 }
    );
  }
} 