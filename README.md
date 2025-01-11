This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

This application is a note-taking app that integrates with Notion. Users can create, edit, and manage notes locally, and optionally post them to a Notion database.

## Key Features

- **Note Management**: Create, edit, and delete notes. Notes are stored locally in the browser's local storage.
- **Notion Integration**: Post notes to a specified Notion database using the Notion API.
- **API Configuration**: Configure Notion API credentials through a modal interface.

## Important Files

- **`app/api/notion/route.ts`**: Handles the POST requests to the Notion API. It creates a new page in the specified Notion database with the provided content.

- **`app/components/NotionApiModal.tsx`**: A React component that provides a modal interface for users to input and save their Notion API key and database ID.

- **`app/utils/notion.ts`**: Contains utility functions for initializing the Notion client and posting data to Notion.

- **`app/page.tsx`**: The main page component of the app. It manages the state of notes, handles user interactions, and integrates with the Notion API.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
