# RawNotes - A Minimalist Note-Taking App with Notion Integration

![License](https://img.shields.io/badge/license-MIT-blue.svg)

RawNotes is a minimalist note-taking application built with Next.js that allows you to quickly capture thoughts and optionally sync them to Notion. It features a clean, distraction-free interface with local storage for your notes.

## 🚀 Features

- **Minimalist Note Management**
  - Create, edit, and delete notes
  - Browser-based local storage
  - Title and content support
  - Block limit warning (95 blocks)
  - Quick navigation between notes

- **Notion Integration**
  - Post notes to Notion with a single click
  - Post and delete functionality
  - Secure API key and database ID storage
  - Automatic title generation from content

- **User Interface**
  - Clean, distraction-free design
  - Keyboard-friendly interface
  - Block count indicator
  - Settings modal for Notion configuration

## 📋 Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- A Notion account and API key (optional)
- A Notion database to connect to (optional)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/edwindoit/raw-notes.git
cd rawnotes
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Notion Setup (Optional)
1. Create a new integration in the [Notion Developers](https://www.notion.so/my-integrations) page
2. Copy your integration token
3. Create a new database in Notion
4. Share the database with your integration
5. Copy the database ID from the URL

### Using the App
1. Click the settings icon (gear) in the top right to configure Notion integration
2. Enter your Notion API key and database ID
3. Start creating notes!

## 🎯 Key Features in Detail

### Note Management
- Create new notes with the "New" button
- Navigate between notes with the "Next" button
- Delete notes with the "Del" button
- Notes are automatically saved to local storage
- Each note can have a title and content

### Notion Integration
- "Post" button: Sends the current note to Notion
- "P&D" button: Posts to Notion and deletes the local note
- Automatic title generation from content if no title is provided
- Secure storage of API credentials

### Block Management
- Visual warning when approaching block limit (95 blocks)
- Block count indicator
- Automatic saving of notes

## 🏗️ Project Structure

```
my-notes-app/
├── app/
│   ├── api/           # API routes for Notion integration
│   ├── components/    # React components
│   ├── utils/         # Utility functions
│   └── page.tsx       # Main application page
├── public/            # Static assets
└── package.json       # Project dependencies
```

## 🔒 Security Considerations

- Notion API keys are stored securely in cookies
- All API calls are made server-side
- No sensitive data is stored in local storage
- Regular security audits are recommended

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style
- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Include tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Notion API](https://developers.notion.com/) for the integration capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 📈 Roadmap

- [ ] Add keyboard shortcuts
- [ ] Implement note search functionality
- [ ] Add note categories/tags
- [ ] Support for markdown formatting
- [ ] Mobile app development
