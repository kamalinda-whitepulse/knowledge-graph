import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { GraphData } from '../types/graph.types';

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

export default function GraphCanvas({ data, onNodeClick }: Props) {
  // convert API data to React Flow format
  const initialNodes: Node[] = data.nodes.map((n) => ({
    id:       n.id,
    position: {
      // spread nodes in a circle layout
      x: Math.random() * 600,
      y: Math.random() * 400,
    },
    data:  { label: n.data.label },
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

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        fitView
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
