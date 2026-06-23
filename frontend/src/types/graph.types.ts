export enum RelationshipType {
  RELATED_TO = 'Related To',
  DEPENDS_ON = 'Depends On',
  REFERENCES = 'References',
  PARENT_OF  = 'Parent Of',
}

export type GraphNode = {
  id: string;
  data: {
    label: string;
    tags: string[];
  };
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type Connection = {
  linkId: string; // backend maps _id to linkId in graph.service.ts
  type: RelationshipType;
  note: {
    _id: string;
    title: string;
    tags: string[];
  };
};
