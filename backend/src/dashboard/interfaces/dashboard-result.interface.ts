export interface MostConnectedNote {
  count: number;
  title: string;
  tags: string[];
}

export interface RecentNote {
  title: string;
  tags: string[];
  createdAt: Date;
}

export interface DashboardResult {
  totalNotes: number;
  totalConnections: number;  // directed edge count (each A→B stored once)
  mostConnected: MostConnectedNote[]; // per-note: in-degree + out-degree
  recentNotes: RecentNote[];
}
