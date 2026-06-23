import api from './axios';

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
    api.get('/notes'),

  getOne: (id: string) =>
    api.get(`/notes/${id}`),

  create: (data: CreateNotePayload) =>
    api.post('/notes', data),

  update: (id: string, data: UpdateNotePayload) =>
    api.put(`/notes/${id}`, data),

  delete: (id: string) =>
    api.delete(`/notes/${id}`),

  search: (query: string) =>
    api.get(`/notes/search?query=${encodeURIComponent(query)}`),

};
