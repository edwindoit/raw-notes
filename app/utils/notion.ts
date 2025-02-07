let notionApiKey: string | null = null;

export const initializeNotion = (apiKey: string) => {
  notionApiKey = apiKey;
};

export const postToNotion = async (databaseId: string, content: string, title?: string) => {
  if (!notionApiKey) {
    throw new Error('Notion API key not initialized');
  }

  const response = await fetch('/api/notion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      databaseId,
      content,
      title,
      apiKey: notionApiKey,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to post to Notion');
  }

  return response.json();
};