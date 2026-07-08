import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { parseRSSFeed } from "@/lib/rss";

export async function POST() {
  try {
    // 1. 获取所有活跃的订阅
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("is_active", true);

    if (subError) {
      throw new Error(`获取订阅失败: ${subError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "没有活跃的订阅",
      });
    }

    // 2. 遍历每个订阅，抓取文章
    const results = [];
    let totalNewArticles = 0;

    for (const subscription of subscriptions) {
      try {
        const feed = await parseRSSFeed(subscription.rss_url);
        let newCount = 0;

        for (const item of feed.items) {
          if (!item.link) continue;

          // 检查文章是否已存在
          const { data: existingArticle } = await supabaseAdmin
            .from("articles")
            .select("id")
            .eq("link", item.link)
            .single();

          if (existingArticle) continue;

          // 插入新文章
          const { error: insertError } = await supabaseAdmin
            .from("articles")
            .insert({
              title: item.title,
              link: item.link,
              content: item.content || item.contentSnippet || "",
              source: subscription.name,
              pub_date: item.pubDate || new Date().toISOString(),
            });

          if (!insertError) {
            newCount++;
          }
        }

        results.push({
          subscription: subscription.name,
          total: feed.items.length,
          new: newCount,
        });

        totalNewArticles += newCount;
      } catch (error) {
        results.push({
          subscription: subscription.name,
          error: error instanceof Error ? error.message : "未知错误",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `成功抓取 ${totalNewArticles} 篇新文章`,
      results,
    });
  } catch (error) {
    console.error("抓取文章失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}