import api from './axios';
import type { Note } from '../types/note.types';

export type CreateNotePayload = {
  title: string;
  content?: string;
  tags?: string[];
};

export type UpdateNotePayload = {
  title?: string;
  content?: string;
  tags?: string[];
};

export const notesApi = {

  getAll: () =>
    api.get<Note[]>('/notes'),

  getOne: (id: string) =>
    api.get<Note>(`/notes/${id}`),

  create: (data: CreateNotePayload) =>
    api.post<Note>('/notes', data),

  update: (id: string, data: UpdateNotePayload) =>
    api.put<Note>(`/notes/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/notes/${id}`),

  search: (query: string) =>
    api.get<Note[]>(`/notes/search?query=${encodeURIComponent(query)}`),

};
