/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import React from "react";
import { initializeNotion, postToNotion } from "./utils/notion";
import NotionApiModal from "./components/NotionApiModal";

// Initialize the client before making any calls
// This should be done early in your app's lifecycle
initializeNotion(process.env.NEXT_PUBLIC_NOTION_API_KEY || '');

export default function Home() {
  const [text, setText] = React.useState('');
  const [blockCount, setBlockCount] = React.useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = React.useState(0);
  const [notes, setNotes] = React.useState<Array<{title: string; content: string}>>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [showApiModal, setShowApiModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [title, setTitle] = React.useState('');

  const BLOCK_LIMIT = 95;
  const WARNING_THRESHOLD = 10;

  React.useEffect(() => {
    // Check for stored Notion credentials
    const storedApiKey = localStorage.getItem('notion_api_key');
    const storedDatabaseId = localStorage.getItem('notion_database_id');
    
    if (storedApiKey && storedDatabaseId) {
      initializeNotion(storedApiKey);
    }

    // Load all saved notes
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      setText(parsedNotes[0]?.content || '');
      setTitle(parsedNotes[0]?.title || '');
    } else {
      // Initialize with one empty note
      setNotes([{ title: '', content: '' }]);
    }
    textareaRef.current?.focus();
  }, []);

  // Add a new useEffect for focusing after state changes
  React.useEffect(() => {
    textareaRef.current?.focus();
  }, [text, currentNoteIndex]); // Re-focus when text or current note changes

  // Add debounced block counting
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const count = text.split('\n').filter(line => line.trim().length > 0).length;
      setBlockCount(count);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const currentBlockCount = newText.split('\n').filter(line => line.trim().length > 0).length;
    
    if (currentBlockCount <= BLOCK_LIMIT || currentBlockCount <= blockCount) {
      setText(newText);
      
      const updatedNotes = [...notes];
      updatedNotes[currentNoteIndex] = {
        ...updatedNotes[currentNoteIndex],
        content: newText
      };
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  const handleNewNote = () => {
    const updatedNotes = [...notes, { title: '', content: '' }];
    setNotes(updatedNotes);
    setCurrentNoteIndex(updatedNotes.length - 1);
    setText('');
    setTitle('');
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    textareaRef.current?.focus();
  };

  const handleNextNote = () => {
    const nextIndex = (currentNoteIndex + 1) % notes.length;
    setCurrentNoteIndex(nextIndex);
    setText(notes[nextIndex].content);
    setTitle(notes[nextIndex].title);
    textareaRef.current?.focus();
  };

  const handleDeleteNote = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = [...notes];
      updatedNotes.splice(currentNoteIndex, 1);
      setNotes(updatedNotes);
      
      if (updatedNotes.length > 0) {
        const newIndex = Math.max(0, currentNoteIndex - 1);
        setCurrentNoteIndex(newIndex);
        setText(updatedNotes[newIndex].content);
        setTitle(updatedNotes[newIndex].title);
      } else {
        setText('');
        setTitle('');
        setNotes([{ title: '', content: '' }]);
      }
      
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  const handleApiConfig = (apiKey: string, databaseId: string) => {
    localStorage.setItem('notion_api_key', apiKey);
    localStorage.setItem('notion_database_id', databaseId);
    initializeNotion(apiKey);
    setShowApiModal(false);
  };

  const handlePostAndDelete = async () => {
    try {
      const apiKey = localStorage.getItem('notion_api_key');
      const databaseId = localStorage.getItem('notion_database_id');
      
      if (!apiKey || !databaseId) {
        setShowApiModal(true);
        return;
      }

      await postToNotion(databaseId, text);
      // After successful post, delete the note
      const updatedNotes = [...notes];
      updatedNotes.splice(currentNoteIndex, 1);
      setNotes(updatedNotes);
      
      if (updatedNotes.length > 0) {
        setCurrentNoteIndex(Math.max(0, currentNoteIndex - 1));
        setText(updatedNotes[Math.max(0, currentNoteIndex - 1)]?.content || '');
        setTitle(updatedNotes[Math.max(0, currentNoteIndex - 1)]?.title || '');
      } else {
        setText('');
        setTitle('');
      }
      
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      alert('Successfully posted to Notion and deleted the note!');
    } catch (error) {
      console.error('Error posting to Notion:', error);
      alert('Failed to post to Notion. Note was not deleted.');
    }
  };

  const handlePostToNotion = async () => {
    try {
      const apiKey = localStorage.getItem('notion_api_key');
      const databaseId = localStorage.getItem('notion_database_id');
      
      if (!apiKey || !databaseId) {
        setShowApiModal(true);
        return;
      }

      await postToNotion(databaseId, text);
      alert('Successfully posted to Notion!');
    } catch (error) {
      console.error('Error posting to Notion:', error);
      alert('Failed to post to Notion. Please check your API configuration.');
    }
  };

  return (
    <div className="fixed inset-0">
      <main className="flex flex-col w-full max-w-2xl mx-auto h-full px-4 mt-4">
        <div className="sticky top-0 z-10 bg-inherit backdrop-blur-sm">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              const updatedNotes = [...notes];
              updatedNotes[currentNoteIndex] = {
                ...updatedNotes[currentNoteIndex],
                title: e.target.value
              };
              setNotes(updatedNotes);
              localStorage.setItem('notes', JSON.stringify(updatedNotes));
            }}
            className="w-full py-0 px-2 font-bold border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none"
            placeholder="."
          />
        </div>
        <div className="h-[calc(100%-420px)]">
          <textarea 
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            className={`w-full h-full p-4 rounded-lg border-2 ${
              blockCount >= BLOCK_LIMIT 
                ? 'border-red-500' 
                : blockCount > BLOCK_LIMIT - WARNING_THRESHOLD 
                  ? 'border-yellow-500' 
                  : 'border-black/[.08] dark:border-white/[.145]'
            } bg-transparent resize-none focus:outline-none`}
            placeholder="Start typing..."
          />
        </div>
        
        <div className="fixed bottom-[310px] left-0 right-0 py-4 bg-inherit backdrop-blur-sm">
          <div className="flex justify-between max-w-2xl mx-auto px-4">
            <button 
              onClick={() => setShowApiModal(true)}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
            >
              API
            </button>
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteNote}
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
              >
                Del
              </button>
              <button 
                onClick={handlePostAndDelete}
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
              >
                P&D
              </button>
              <button 
                onClick={handlePostToNotion}
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
              >
                Post
              </button>
              <button 
                onClick={handleNextNote}
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
              >
                Next
              </button>
              <button 
                onClick={handleNewNote}
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
              >
                New
              </button>
            </div>
          </div>
        </div>
      </main>

      {showApiModal && (
        <NotionApiModal
          onClose={() => setShowApiModal(false)}
          onSave={handleApiConfig}
        />
      )}
    </div>
  );
}
