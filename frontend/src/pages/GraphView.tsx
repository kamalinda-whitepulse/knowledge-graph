import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphApi } from '../api/graph.api';
import type { GraphData } from '../types/graph.types';
import GraphCanvas from '../components/GraphCanvas';

export default function GraphView() {
  const navigate = useNavigate();

  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await graphApi.getFullGraph();
        setGraphData(res.data);
      } catch {
        setError('Failed to load graph');
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  const handleNodeClick = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Knowledge Graph</h1>
            <p className="text-violet-200 text-sm mt-1">
              {graphData?.nodes.length ?? 0} notes · {graphData?.edges.length ?? 0} connections
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-violet-200 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Empty state */}
      {graphData?.nodes.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No graph yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Create some notes and link them together to see your knowledge graph
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-sm bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Graph canvas */}
      {graphData && graphData.nodes.length > 0 && (
        <div className="relative" style={{ height: 'calc(100vh - 140px)' }}>

          {/* Hint */}
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-sm border border-gray-100 px-3 py-2">
            <p className="text-xs text-gray-500">
              Click a node to open the note · Drag to move · Scroll to zoom
            </p>
          </div>

          <GraphCanvas
            data={graphData}
            onNodeClick={handleNodeClick}
          />
        </div>
      )}

    </div>
  );
}
