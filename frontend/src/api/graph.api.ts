import api from './axios';
import type { GraphData, Connection, RelationshipType } from '../types/graph.types';

export const graphApi = {

  getFullGraph: () =>
    api.get<GraphData>('/graph'),

  getConnections: (noteId: string) =>
    api.get<{ incoming: Connection[]; outgoing: Connection[] }>(`/graph/${noteId}`),

  createLink: (fromNoteId: string, toNoteId: string, type: RelationshipType) =>
    api.post<void>('/graph/link', { fromNoteId, toNoteId, type }),

  deleteLink: (linkId: string) =>
    api.delete<void>(`/graph/link/${linkId}`),

};
