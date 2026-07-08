// 订阅类型
export interface Subscription {
  id: string;
  name: string;
  rss_url: string;
  is_active: boolean;
  created_at: string;
}

// 文章类型
export interface Article {
  id: string;
  title: string;
  link: string;
  content?: string;
  source?: string;
  pub_date?: string;
  analysis?: ArticleAnalysis;
  created_at: string;
}

// AI 分析结果类型
export interface ArticleAnalysis {
  summary: string;
  insights: Array<{
    point: string;
    evidence: string;
  }>;
  quotes: string[];
  newConcepts?: Array<{
    term: string;
    explanation: string;
  }>;
}