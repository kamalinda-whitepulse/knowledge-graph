import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesApi } from '../api/notes.api';
import { graphApi } from '../api/graph.api';
import type { Note } from '../types/note.types';
import type { Connection } from '../types/graph.types';
import { RelationshipType } from '../types/graph.types';
import TagBadge from '../components/TagBadge';

export default function NoteDetail() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();

  const [note, setNote]               = useState<Note | null>(null);
  const [incoming, setIncoming]       = useState<Connection[]>([]);
  const [outgoing, setOutgoing]       = useState<Connection[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // edit state
  const [editing, setEditing]         = useState(false);
  const [editTitle, setEditTitle]     = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags]       = useState('');
  const [saving, setSaving]           = useState(false);

  // link state
  const [showLinkModal, setShowLinkModal]   = useState(false);
  const [allNotes, setAllNotes]             = useState<Note[]>([]);
  const [linkToId, setLinkToId]             = useState('');
  const [linkType, setLinkType]             = useState<RelationshipType>(RelationshipType.RELATED_TO);
  const [linking, setLinking]               = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [noteRes, connRes] = await Promise.all([
          notesApi.getOne(id),
          graphApi.getConnections(id),
        ]);
        setNote(noteRes.data);
        setEditTitle(noteRes.data.title);
        setEditContent(noteRes.data.content);
        setEditTags(noteRes.data.tags.join(', '));
        setIncoming(connRes.data.incoming);
        setOutgoing(connRes.data.outgoing);
      } catch {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const tags = editTags.split(',').map(t => t.trim()).filter(Boolean);
      const res  = await notesApi.update(id, {
        title:   editTitle,
        content: editContent,
        tags,
      });
      setNote(res.data);
      setEditing(false);
    } catch {
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesApi.delete(id);
      navigate('/');
    } catch {
      setError('Failed to delete note');
    }
  };

  const handleOpenLinkModal = async () => {
    try {
      const res = await notesApi.getAll();
      setAllNotes(res.data.filter((n: Note) => n._id !== id));
      setShowLinkModal(true);
    } catch {
      setError('Failed to load notes');
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !linkToId) return;
    setLinking(true);
    try {
      await graphApi.createLink(id, linkToId, linkType);
      const connRes = await graphApi.getConnections(id);
      setOutgoing(connRes.data.outgoing);
      setShowLinkModal(false);
      setLinkToId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create link');
    } finally {
      setLinking(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await graphApi.deleteLink(linkId);
      const connRes = await graphApi.getConnections(id!);
      setIncoming(connRes.data.incoming);
      setOutgoing(connRes.data.outgoing);
    } catch {
      setError('Failed to delete link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading note...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error || 'Note not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-violet-200 text-sm hover:text-white mb-4 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          {editing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-b border-violet-300 text-white w-full focus:outline-none"
            />
          ) : (
            <h1 className="text-2xl font-bold text-white">{note.title}</h1>
          )}
          <div className="flex gap-2 mt-3 flex-wrap">
            {note.tags.map((tag) => (
              <span key={tag} className="bg-violet-500/40 text-white text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main note content */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">

              {editing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={8}
                    placeholder="Content"
                    className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none w-full"
                  />
                  <input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="text-sm bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {note.content || 'No content yet.'}
                  </p>
                  <p className="text-gray-400 text-xs mt-4">
                    Created {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>

            {/* Action buttons */}
            {!editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit Note
                </button>
                <button
                  onClick={handleOpenLinkModal}
                  className="text-sm border border-violet-300 text-violet-600 px-4 py-2 rounded-lg hover:bg-violet-50"
                >
                  + Link Note
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 ml-auto"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Connections sidebar */}
          <div className="flex flex-col gap-4">

            {/* Outgoing */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Outgoing Links ({outgoing.length})
              </h3>
              {outgoing.length === 0 ? (
                <p className="text-gray-400 text-xs">No outgoing links</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {outgoing.map((conn) => (
                    <div key={conn.linkId} className="flex items-center justify-between gap-2">
                      <div>
                        {/* use conn.note directly  */}
                        <button
                          onClick={() => navigate(`/notes/${conn.note._id}`)}
                          className="text-sm text-violet-600 hover:underline font-medium text-left"
                        >
                          {conn.note.title}
                        </button>
                        <p className="text-xs text-gray-400">{conn.type}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLink(conn.linkId)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Incoming */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Incoming Links ({incoming.length})
              </h3>
              {incoming.length === 0 ? (
                <p className="text-gray-400 text-xs">No incoming links</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {incoming.map((conn) => (
                    <div key={conn.linkId}>
                      {/* use conn.note directly */}
                      <button
                        onClick={() => navigate(`/notes/${conn.note._id}`)}
                        className="text-sm text-violet-600 hover:underline font-medium text-left"
                      >
                        {conn.note.title}
                      </button>
                      <p className="text-xs text-gray-400">{conn.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
              {note.tags.length === 0 ? (
                <p className="text-gray-400 text-xs">No tags</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleCreateLink}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">Link to another note</h2>

            <select
              value={linkToId}
              onChange={(e) => setLinkToId(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select a note...</option>
              {allNotes.map((n) => (
                <option key={n._id} value={n._id}>{n.title}</option>
              ))}
            </select>

            <select
              value={linkType}
              // cast only at the onChange boundary where raw string comes in
              onChange={(e) => setLinkType(e.target.value as RelationshipType)}
              className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {Object.values(RelationshipType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={linking}
                className="text-sm bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {linking ? 'Linking...' : 'Create Link'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}