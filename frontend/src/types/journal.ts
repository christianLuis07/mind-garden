export interface JournalEntry {
  id: string;
  userId: string;
  title?: string;
  content: string;
  images: string[];
  sentimentScore?: number; // Legacy score
  aiSentiment?: string;   // Anxiety, Depression, Positive, Neutral
  riskScore?: number;     // 1-10
  tags?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface JournalAnalytics {
  overview: {
    totalEntries: number;
    averageSentiment: number;
    totalWords: number;
    writingFrequency: {
      daily: Record<string, number>;
      totalDays: number;
      entriesPerDay: number;
    };
  };
  sentiment: {
    average: number;
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  tags: Record<string, number>;
  wordCount: {
    average: number;
    max: number;
    min: number;
    totalWords: number;
  };
  recentActivity: JournalEntry[];
}

export interface CreateJournalData {
  title?: string;
  content: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateJournalData {
  title?: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
}
