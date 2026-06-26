import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard.api';
import { notesApi } from '../api/notes.api';
import { useNotesStore } from '../store/notesStore';
import type { DashboardResult } from '../types/dashboard.types';
import NoteCard from '../components/NoteCard';
import TagBadge from '../components/TagBadge';
import NoteEditor from '../components/NoteEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  // Fix 3: use selectors to avoid subscribing to the entire store
  const notes    = useNotesStore((s) => s.notes);
  const setNotes = useNotesStore((s) => s.setNotes);

  const [stats, setStats]         = useState<DashboardResult | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showEditor, setShowEditor] = useState(false);

  const fetchData = async () => {
    try {
      const [dashRes, notesRes] = await Promise.all([
        dashboardApi.getStats(),
        notesApi.getAll(),
      ]);
      setStats(dashRes.data);
      setNotes(notesRes.data);
    } catch {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [setNotes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-violet-200 text-sm mt-1">
              Your Personal Knowledge Graph
            </p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-2 bg-white text-violet-600 font-medium text-sm px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors"
          >
            + New Note
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Fix 4: use NoteEditor with onSuccess to refresh stats after creation */}
        {showEditor && (
          <NoteEditor
            onClose={() => setShowEditor(false)}
            onSuccess={fetchData}
          />
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Total Notes</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {stats?.totalNotes ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Total Connections</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {stats?.totalConnections ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Most Connected</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {stats?.mostConnected[0]?.count ?? 0}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {stats?.mostConnected[0]?.title ?? '—'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Graph View</p>
            <button
              onClick={() => navigate('/graph')}
              className="mt-1 text-sm font-medium text-violet-600 hover:underline"
            >
              Open Graph →
            </button>
          </div>

        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Most connected notes */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Most Connected
            </h2>
            {!stats?.mostConnected?.length ? (
              <p className="text-gray-400 text-xs">No connections yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.mostConnected.map((note, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{note.title}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {note.tags.map((tag) => (
                          <TagBadge key={tag} tag={tag} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                      {note.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently created */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Recently Created
            </h2>
            {stats?.recentNotes.length === 0 ? (
              <p className="text-gray-400 text-xs">No notes yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats?.recentNotes.map((note, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-800">{note.title}</p>
                    <div className="flex gap-1 flex-wrap">
                      {note.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All notes */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              All Notes
            </h2>
            {notes.length === 0 ? (
              <p className="text-gray-400 text-xs">No notes yet — create your first one!</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {notes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
