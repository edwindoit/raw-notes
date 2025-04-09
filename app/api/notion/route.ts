import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { content, title } = await request.json();
    
    // Get credentials from cookies
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('notion_api_key')?.value;
    const databaseId = cookieStore.get('notion_database_id')?.value;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { success: false, error: 'Notion credentials not found. Please configure your API key and database ID.' },
        { status: 401 }
      );
    }

    const notion = new Client({ auth: apiKey });

    // Test the connection by trying to retrieve the database
    try {
      const database = await notion.databases.retrieve({ database_id: databaseId });
      console.log('Successfully connected to database');
    } catch (dbError) {
      console.error('Failed to retrieve database:', dbError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to access database. Please check your database ID and API key.' 
      }, { status: 400 });
    }

    // Create the page with minimal properties
    const response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: databaseId
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title || ('r.' + content.slice(0, 100)),
              },
            },
          ],
        },
      },
      children: content.split('\n').map((line: string) => ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: line,
              },
            },
          ],
        },
      })),
    });

    console.log('Successfully created page:', response.id);
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error posting to Notion:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to post to Notion' 
    }, { status: 500 });
  }
}