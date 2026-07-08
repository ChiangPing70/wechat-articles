"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FetchButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fetch-articles", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        router.refresh();
      } else {
        alert("抓取失败: " + (data.error || "未知错误"));
      }
    } catch (error) {
      alert("请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFetch}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
    >
      {loading ? "抓取中..." : "抓取新文章"}
    </button>
  );
}