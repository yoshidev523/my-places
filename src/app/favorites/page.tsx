import { getFavoritePlaces } from '@/app/actions/favorites';
import { PlaceCard } from '@/components/place';

/**
 * お気に入り一覧ページのメタデータ
 */
export const metadata = {
  title: 'お気に入り | My Places',
  description: 'お気に入りに登録したPOI一覧を表示します',
};

/**
 * お気に入りが空の場合の表示コンポーネント
 */
function EmptyFavorites() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❤️</div>
        <p className="text-gray-500 text-lg">
          お気に入りがまだありません
        </p>
        <p className="text-gray-400 mt-2">
          場所を検索してお気に入りに追加してみましょう
        </p>
        <a 
          href="/" 
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          場所を検索する
        </a>
      </div>
    </div>
  );
}

/**
 * エラー表示コンポーネント
 */
function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium">
          エラーが発生しました
        </div>
        <p className="text-gray-600 mt-2">{error}</p>
        <p className="text-gray-400 mt-2 text-sm">
          しばらく時間をおいてから再度お試しください
        </p>
      </div>
    </div>
  );
}

/**
 * お気に入り一覧ページ
 */
export default async function FavoritesPage() {
  // サーバーアクション経由でお気に入りデータを取得
  const result = await getFavoritePlaces();

  // エラー時
  if (!result.success) {
    return <ErrorMessage error={result.error || 'データの取得に失敗しました'} />;
  }

  const places = result.places || [];

  // お気に入りが空の場合
  if (places.length === 0) {
    return <EmptyFavorites />;
  }

  // お気に入り一覧を表示
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          お気に入り
        </h1>
        <p className="text-gray-600 mt-2">
          お気に入りに登録したPOI一覧 ({places.length}件)
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {places.map((place) => (
          <PlaceCard 
            key={place.place_id} 
            place={place} 
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
} 