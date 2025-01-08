'use client';
import React from "react";
import { initializeNotion, postToNotion } from "./utils/notion";
import NotionApiModal from "./components/NotionApiModal";

// Initialize the client before making any calls
// This should be done early in your app's lifecycle
initializeNotion(process.env.NEXT_PUBLIC_NOTION_API_KEY || '');

export default function Home() {
  const [text, setText] = React.useState('');
  const [currentNoteIndex, setCurrentNoteIndex] = React.useState(0);
  const [notes, setNotes] = React.useState<string[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [showApiModal, setShowApiModal] = React.useState(false);
  const [notionConfigured, setNotionConfigured] = React.useState(false);

  React.useEffect(() => {
    // Check for stored Notion credentials
    const storedApiKey = localStorage.getItem('notion_api_key');
    const storedDatabaseId = localStorage.getItem('notion_database_id');
    
    if (storedApiKey && storedDatabaseId) {
      initializeNotion(storedApiKey);
      setNotionConfigured(true);
    }

    // Load all saved notes
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      setText(parsedNotes[0] || '');
    } else {
      // Initialize with one empty note
      setNotes(['']);
    }
    // Add focus here
    textareaRef.current?.focus();
  }, []); // Initial load

  // Add a new useEffect for focusing after state changes
  React.useEffect(() => {
    textareaRef.current?.focus();
  }, [text, currentNoteIndex]); // Re-focus when text or current note changes

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Update the current note in the notes array
    const updatedNotes = [...notes];
    updatedNotes[currentNoteIndex] = newText;
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handleNewNote = () => {
    const updatedNotes = [...notes, ''];
    setNotes(updatedNotes);
    setCurrentNoteIndex(updatedNotes.length - 1);
    setText('');
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    textareaRef.current?.focus();
  };

  const handleNextNote = () => {
    const nextIndex = (currentNoteIndex + 1) % notes.length;
    setCurrentNoteIndex(nextIndex);
    setText(notes[nextIndex]);
    textareaRef.current?.focus();
  };

  const handleDeleteNote = () => {
    if (notes.length <= 1) {
      // Don't delete if it's the last note, just clear it
      setText('');
      setNotes(['']);
      localStorage.setItem('notes', JSON.stringify(['']));
      return;
    }

    const updatedNotes = notes.filter((_, index) => index !== currentNoteIndex);
    setNotes(updatedNotes);
    
    // Move to the previous note, or the next one if we're at the beginning
    const newIndex = currentNoteIndex > 0 ? currentNoteIndex - 1 : 0;
    setCurrentNoteIndex(newIndex);
    setText(updatedNotes[newIndex]);
    
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handleApiConfig = (apiKey: string, databaseId: string) => {
    localStorage.setItem('notion_api_key', apiKey);
    localStorage.setItem('notion_database_id', databaseId);
    initializeNotion(apiKey);
    setNotionConfigured(true);
    setShowApiModal(false);
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
        <div className="h-[calc(100%-400px)]">
          <textarea 
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            className="w-full h-full p-4 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent resize-none focus:outline-none"
            placeholder="Start typing..."
          />
        </div>
        
        <div className="fixed bottom-[300px] left-0 right-0 py-4 bg-inherit backdrop-blur-sm">
          <div className="flex gap-2 max-w-2xl mx-auto px-4">
            <button 
              onClick={handleNewNote}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
            >
              New
            </button>
            <button 
              onClick={handleNextNote}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
            >
              Next
            </button>
            <button 
              onClick={handleDeleteNote}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
            >
              Del
            </button>
            <button 
              onClick={() => setShowApiModal(true)}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
            >
              API
            </button>
            <button 
              onClick={handlePostToNotion}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 sm:px-4 h-9 sm:h-10 text-sm sm:text-base min-w-[60px]"
            >
              Post
            </button>
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
