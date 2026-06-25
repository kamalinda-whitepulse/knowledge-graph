import { useNavigate } from 'react-router-dom';
import type { Note } from '../types/note.types';
import TagBadge from './TagBadge';

type Props = {
  note: Note;
};

export default function NoteCard({ note }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/notes/${note._id}`)}
      className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-violet-200 cursor-pointer transition-all"
    >
      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
        {note.title}
      </h3>

      {note.content && (
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
          {note.content}
        </p>
      )}

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      <p className="text-gray-400 text-xs mt-3">
        {new Date(note.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
