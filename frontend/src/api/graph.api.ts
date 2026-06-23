import api from './axios';
import { RelationshipType } from '../types/graph.types';

export const graphApi = {

  getFullGraph: () =>
    api.get('/graph'),

  getConnections: (noteId: string) =>
    api.get(`/graph/${noteId}`),

  createLink: (fromNoteId: string, toNoteId: string, type: RelationshipType) =>
    api.post('/graph/link', { fromNoteId, toNoteId, type }),

  deleteLink: (linkId: string) =>
    api.delete(`/graph/link/${linkId}`),

};
