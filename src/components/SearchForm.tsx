import { searchPlacesAction } from '@/app/actions/searchPlaces';

/**
 * 場所検索フォームコンポーネント
 */
export function SearchForm() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form action={searchPlacesAction} className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="query" className="sr-only">
            検索クエリ
          </label>
          <input
            type="text"
            name="query"
            id="query"
            placeholder="場所を検索（例：東京駅 レストラン）"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            required
          />
        </div>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          検索
        </button>
      </form>
    </div>
  );
} 