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
  totalConnections: number;
  mostConnected: MostConnectedNote[];
  recentNotes: RecentNote[];
}
