import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { GraphData } from '../types/graph.types';
import { useGraphStore } from '../store/graphStore';

type Props = {
  data: GraphData;
  onNodeClick: (noteId: string) => void;
};

// custom node style
const nodeDefaults = {
  style: {
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 500,
    minWidth: '120px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 12px rgba(109, 40, 217, 0.3)',
  },
};

// Deterministic fallback position - spreads nodes in a grid so the
// initial layout is always the same when there are no saved positions.
function defaultPosition(index: number, total: number) {
  const cols  = Math.ceil(Math.sqrt(total));
  const col   = index % cols;
  const row   = Math.floor(index / cols);
  return { x: col * 220 + 60, y: row * 160 + 60 };
}

export default function GraphCanvas({ data, onNodeClick }: Props) {
  const savePositions = useGraphStore((s) => s.savePositions);
  const getPosition   = useGraphStore((s) => s.getPosition);
  // Fix 2: use hook selector instead of static getState() so component
  // re-renders correctly if nodePositions changes while mounted.
  const hasPositions  = useGraphStore((s) => Object.keys(s.nodePositions).length > 0);

  // Use saved position if it exists, otherwise fall back to deterministic grid.
  const initialNodes: Node[] = data.nodes.map((n, i) => ({
    id:       n.id,
    position: getPosition(n.id) ?? defaultPosition(i, data.nodes.length),
    data:     { label: n.data.label },
    ...nodeDefaults,
  }));

  const initialEdges: Edge[] = data.edges.map((e) => ({
    id:           e.id,
    source:       e.source,
    target:       e.target,
    label:        e.label,
    animated:     true,
    style:        { stroke: '#7c3aed', strokeWidth: 2 },
    labelStyle:   { fontSize: 11, fill: '#6d28d9', fontWeight: 500 },
    labelBgStyle: { fill: '#ede9fe', fillOpacity: 0.8 },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Save positions to the store whenever nodes are moved.
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      // Persist after any position change (drag)
      const hasDrag = changes.some((c) => c.type === 'position' && !c.dragging);
      if (hasDrag) {
        setNodes((current) => {
          savePositions(current);
          return current;
        });
      }
    },
    [onNodesChange, setNodes, savePositions]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        fitView={!hasPositions}
        attributionPosition="bottom-right"
      >
        <MiniMap
          nodeColor="#7c3aed"
          maskColor="rgba(0,0,0,0.1)"
          style={{ borderRadius: 8 }}
        />
        <Controls />
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#e5e7eb"
        />
      </ReactFlow>
    </div>
  );
}
