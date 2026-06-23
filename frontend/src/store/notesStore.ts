import { create } from 'zustand';
import type { Note } from '../types/note.types';

type NotesState = {
  notes:          Note[];
  selectedNote:   Note | null;
  setNotes:       (notes: Note[])       => void;
  setSelectedNote:(note: Note | null)   => void;
  addNote:        (note: Note)          => void;
  updateNote:     (note: Note)          => void;
  deleteNote:     (id: string)          => void;
};

export const useNotesStore = create<NotesState>((set) => ({
  notes:        [],
  selectedNote: null,

  setNotes: (notes) => set({ notes }),

  setSelectedNote: (note) => set({ selectedNote: note }),

  addNote: (note) =>
    set((state) => ({ notes: [note, ...state.notes] })),

  updateNote: (updated) =>
    set((state) => ({
      notes: state.notes.map((n) => n._id === updated._id ? updated : n),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n._id !== id),
    })),
}));
