export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          欢迎使用公众号文章摘要系统
        </h2>
        <p className="text-gray-600 mb-8">
          自动抓取订阅的公众号文章，使用 AI 提炼核心观点
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📡</div>
            <h3 className="font-semibold text-lg mb-2">RSS 抓取</h3>
            <p className="text-gray-600 text-sm">
              通过 RSSHub 自动抓取订阅内容
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-lg mb-2">AI 分析</h3>
            <p className="text-gray-600 text-sm">
              使用 Claude Code 分析文章核心观点
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-lg mb-2">Web 展示</h3>
            <p className="text-gray-600 text-sm">
              清晰的 Web 界面展示文章摘要
            </p>
          </div>
        </div>

        <div className="mt-12">
          <a
            href="/articles"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看文章列表 →
          </a>
        </div>
      </div>
    </div>
  );
}