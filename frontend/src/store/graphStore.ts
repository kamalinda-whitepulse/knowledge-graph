import { create } from 'zustand';
import type { Node } from '@xyflow/react';

type GraphState = {
  nodePositions: Record<string, { x: number; y: number }>;
  savePositions: (nodes: Node[]) => void;
  getPosition:   (id: string) => { x: number; y: number } | null;
};

export const useGraphStore = create<GraphState>((set, get) => ({
  nodePositions: {},

  savePositions: (nodes) => {
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n) => {
      positions[n.id] = { x: n.position.x, y: n.position.y };
    });
    set({ nodePositions: positions });
  },

  getPosition: (id) => {
    return get().nodePositions[id] ?? null;
  },
}));
