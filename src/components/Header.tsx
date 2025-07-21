/**
 * アプリケーションのヘッダーコンポーネント
 */
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">
          My Places
        </h1>
        <p className="text-gray-600 mt-2">
          Places APIを使った場所検索アプリ
        </p>
      </div>
    </header>
  );
} 