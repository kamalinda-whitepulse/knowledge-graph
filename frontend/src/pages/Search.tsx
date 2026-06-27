import { useState } from 'react';
import { notesApi } from '../api/notes.api';
import type { Note } from '../types/note.types';
import SearchBar from '../components/SearchBar';
import NoteCard from '../components/NoteCard';

export default function Search() {
  const [results, setResults]   = useState<Note[]>([]);
  const [loading, setLoading]   = useState(false);
  const [query, setQuery]       = useState('');
  const [searched, setSearched] = useState(false);
  const [error, setError]       = useState('');

  const handleSearch = async (q: string) => {
    setQuery(q);

    // if query is empty clear results
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await notesApi.search(q);
      setResults(res.data);
      setSearched(true);
    } catch {
      setError('Failed to search notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Search</h1>
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            placeholder="Search by title, content or tags..."
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Initial state — not searched yet */}
        {!searched && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              Search across all your notes by title, content or tags
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Searching...</p>
          </div>
        )}

        {/* No results */}
        {searched && !loading && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              No notes found for "{query}"
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Try a different keyword or check your spelling
            </p>
          </div>
        )}

        {/* Results */}
        {searched && !loading && results.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
