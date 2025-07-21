import { Place } from '@/types';
import { PlaceCard } from './place';
import { getFavoriteStatuses } from '@/app/actions/favorites';

/**
 * 検索結果一覧を表示するコンポーネント
 */
export interface SearchResultsProps {
  places: Place[] | null;
  query?: string;
  error?: string | null;
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
 * 検索結果なし表示コンポーネント
 */
function NoResults({ query }: { query?: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {query ? `「${query}」` : ''}検索結果が見つかりませんでした
        </p>
        <p className="text-gray-400 mt-2">
          別のキーワードで検索してみてください
        </p>
      </div>
    </div>
  );
}

/**
 * 検索結果一覧コンポーネント
 */
export async function SearchResults({ places, query, error }: SearchResultsProps) {
  // エラー時
  if (error) {
    return <ErrorMessage error={error} />;
  }

  // 検索していない、または結果なし
  if (!places) {
    return query ? <NoResults query={query} /> : null;
  }

  // 結果が空の場合
  if (places.length === 0) {
    return <NoResults query={query} />;
  }

  // お気に入り状態をサーバーアクション経由で取得
  const placeIds = places.map(place => place.place_id);
  const favoriteStatuses = await getFavoriteStatuses(placeIds);

  // 検索結果を表示
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          検索結果 ({places.length}件)
        </h2>
        {query && (
          <p className="text-gray-600 mt-1">
            「{query}」の検索結果
          </p>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {places.map((place) => (
          <PlaceCard 
            key={place.place_id} 
            place={place} 
            isFavorite={favoriteStatuses.includes(place.place_id)}
          />
        ))}
      </div>
    </div>
  );
} 