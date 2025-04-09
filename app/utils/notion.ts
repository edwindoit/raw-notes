let notionApiKey: string | null = null;

export const initializeNotion = async () => {
  try {
    const response = await fetch('/api/auth');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to initialize Notion');
    }
    
    return data.databaseId;
  } catch (error) {
    console.error('Error initializing Notion:', error);
    throw error;
  }
};

export const postToNotion = async (content: string, title?: string) => {
  const response = await fetch('/api/notion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      title
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to post to Notion: ${errorData.error || response.statusText}`);
  }

  return response.json();
};

export const saveNotionCredentials = async (apiKey: string, databaseId: string) => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey,
      databaseId
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to save credentials: ${errorData.error || response.statusText}`);
  }

  return response.json();
};

export const clearNotionCredentials = async () => {
  const response = await fetch('/api/auth', {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to clear credentials: ${errorData.error || response.statusText}`);
  }

  return response.json();
};