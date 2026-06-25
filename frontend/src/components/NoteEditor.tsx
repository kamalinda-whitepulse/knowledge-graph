import { useState } from 'react';
import { notesApi } from '../api/notes.api';
import { useNotesStore } from '../store/notesStore';

type Props = {
  onClose: () => void;
};

export default function NoteEditor({ onClose }: Props) {
  const { addNote } = useNotesStore();

  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res     = await notesApi.create({
        title,
        content,
        tags: tagList,
      });
      addNote(res.data);
      onClose();
    } catch {
      setError('Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold text-gray-900">New Note</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />

        <input
          type="text"
          placeholder="Tags (comma separated e.g. nestjs, backend)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="text-sm bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
}
