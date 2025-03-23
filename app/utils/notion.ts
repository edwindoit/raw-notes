let notionApiKey: string | null = null;
let notionDatabaseId: string | null = null;

export const initializeNotion = (apiKey: string, databaseId?: string) => {
  notionApiKey = apiKey;
  notionDatabaseId = databaseId || null;
};

export const getNotionConfig = () => {
  return {
    apiKey: notionApiKey,
    databaseId: notionDatabaseId
  };
};

export const postToNotion = async (databaseId: string, content: string, title?: string) => {
  console.log("Checking API key before posting:", notionApiKey ? "API key exists" : "API key is null");
  
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
      apiKey: notionApiKey
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to post to Notion: ${errorData.error || response.statusText}`);
  }

  return response.json();
};