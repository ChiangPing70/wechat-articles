import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ["content", "contentSnippet"],
  },
});

export interface RSSItem {
  title: string;
  link: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  creator?: string;
}

export interface RSSFeed {
  title: string;
  link?: string;
  items: RSSItem[];
}

export async function parseRSSFeed(rssUrl: string): Promise<RSSFeed> {
  try {
    const feed = await parser.parseURL(rssUrl);

    return {
      title: feed.title || "未知来源",
      link: feed.link,
      items: feed.items.map((item) => ({
        title: item.title || "无标题",
        link: item.link || "",
        content: item.content || item.contentSnippet || "",
        contentSnippet: item.contentSnippet || "",
        pubDate: item.pubDate || item.isoDate,
        creator: item.creator,
      })),
    };
  } catch (error) {
    console.error("RSS 解析错误:", error);
    throw error;
  }
}