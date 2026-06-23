export type MostConnectedNote = {
  count: number;
  title: string;
  tags:  string[];
};

export type RecentNote = {
  title:     string;
  tags:      string[];
  createdAt: string;
};

export type DashboardResult = {
  totalNotes:       number;
  totalConnections: number;
  mostConnected:    MostConnectedNote[];
  recentNotes:      RecentNote[];
};
