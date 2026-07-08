"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase-client";
import type { Article } from "@/types";
import { useEffect, useState } from "react";

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      {copied ? "✅ 已复制" : "📋 复制正文"}
    </button>
  );
}

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      supabaseClient
        .from("articles")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }: { data: Article | null; error: any }) => {
          if (error || !data) {
            notFound();
          }
          setArticle(data as Article);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (!article) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/articles"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        ← 返回文章列表
      </Link>

      <article className="bg-white rounded-lg shadow p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
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
        </header>

        {/* AI 分析结果 */}
        {article.analysis && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              🤖 AI 摘要
            </h2>
            <p className="text-gray-700 mb-4">{article.analysis.summary}</p>

            {article.analysis.insights.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">核心观点</h3>
                <ul className="space-y-2">
                  {article.analysis.insights.map((insight, index) => (
                    <li key={index} className="text-gray-700">
                      <span className="font-medium">{insight.point}</span>
                      <p className="text-gray-600 text-sm mt-1">
                        {insight.evidence}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.analysis.quotes.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">金句摘录</h3>
                <ul className="space-y-2">
                  {article.analysis.quotes.map((quote, index) => (
                    <li
                      key={index}
                      className="text-gray-600 italic border-l-4 border-blue-400 pl-4"
                    >
                      "{quote}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 文章正文 */}
        <div className="prose prose-gray max-w-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">原文内容</h2>
            {article.content ? (
              <CopyButton content={article.content} />
            ) : (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔗 打开原文
              </a>
            )}
          </div>

          {article.content ? (
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {article.content}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800 mb-3">
                ⚠️ 公众号文章正文需要从原文获取（微信有反爬保护）
              </p>
              <p className="text-gray-600 mb-4">
                操作步骤：
              </p>
              <ol className="text-gray-600 space-y-2">
                <li>1. 点击上方「打开原文」按钮访问文章</li>
                <li>2. 复制文章正文内容</li>
                <li>3. 使用 <code className="bg-gray-100 px-1 rounded">/wechat-digest</code> 命令让 Claude Code 分析</li>
              </ol>
            </div>
          )}
        </div>

        {/* 原文链接 */}
        <div className="mt-8 pt-6 border-t">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            查看原文 ↗
          </a>
        </div>
      </article>
    </div>
  );
}