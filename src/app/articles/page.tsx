import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/types";
import FetchButton from "./FetchButton";

export const revalidate = 60; // 每分钟重新验证

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("pub_date", { ascending: false })
    .limit(50);

  if (error) {
    console.error("获取文章失败:", error);
    return [];
  }

  return data as Article[];
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">文章列表</h2>
        <div className="flex gap-3">
          <a
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            返回首页
          </a>
          <FetchButton />
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">暂无文章</p>
          <p className="text-gray-400 text-sm mt-2">点击「抓取新文章」按钮获取内容</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>
                      {article.pub_date
                        ? new Date(article.pub_date).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "未知日期"}
                    </span>
                  </div>
                  {article.analysis && (
                    <p className="text-gray-600 mt-3 text-sm line-clamp-2">
                      {article.analysis.summary}
                    </p>
                  )}
                </div>
                {article.analysis && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    已分析
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}