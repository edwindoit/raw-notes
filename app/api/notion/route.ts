import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { databaseId, content, apiKey } = await request.json();
    
    const notion = new Client({ auth: apiKey });

    // Create the page with minimal properties
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: content.slice(0, 50) + '...',
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

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error posting to Notion:', error);
    return NextResponse.json({ success: false, error: 'Failed to post to Notion' }, { status: 500 });
  }
}