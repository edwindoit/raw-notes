import React from 'react';

interface NotionApiModalProps {
  onClose: () => void;
  onSave: (apiKey: string, databaseId: string) => void;
}

export default function NotionApiModal({ onClose, onSave }: NotionApiModalProps) {
  const [apiKey, setApiKey] = React.useState('');
  const [databaseId, setDatabaseId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apiKey, databaseId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Notion API Configuration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="secret_xxx..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Database ID</label>
            <input
              type="text"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="xxx..."
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 