import Link from 'next/link';

/**
 * アプリケーションのヘッダーコンポーネント
 */
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              My Places
            </Link>
            <p className="text-gray-600 mt-2">
              Places APIを使った場所検索アプリ
            </p>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">🔍</span>
              検索
            </Link>
            <Link 
              href="/favorites" 
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">❤️</span>
              お気に入り
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 