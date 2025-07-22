import { getVisitedPlaces } from '@/app/actions/visited';
import { PlaceCard } from '@/components/place';

/**
 * 訪問場所一覧ページのメタデータ
 */
export const metadata = {
  title: '訪問済み | My Places',
  description: '訪問済みに登録したPOI一覧を表示します',
};

/**
 * 訪問場所が空の場合の表示コンポーネント
 */
function EmptyVisited() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">✓</div>
        <p className="text-gray-500 text-lg">
          訪問済みの場所がまだありません
        </p>
        <p className="text-gray-400 mt-2">
          場所を検索して訪問済みにマークしてみましょう
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
 * 訪問済み一覧ページ
 */
export default async function VisitedPage() {
  // サーバーアクション経由で訪問済みデータを取得
  const result = await getVisitedPlaces();

  // エラー時
  if (!result.success) {
    return <ErrorMessage error={result.error || 'データの取得に失敗しました'} />;
  }

  const places = result.places || [];

  // 訪問済みが空の場合
  if (places.length === 0) {
    return <EmptyVisited />;
  }

  // 訪問済み一覧を表示
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          訪問済み
        </h1>
        <p className="text-gray-600 mt-2">
          訪問済みに登録したPOI一覧 ({places.length}件)
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {places.map((place) => (
          <PlaceCard 
            key={place.place_id} 
            place={place} 
            isVisited={true}
          />
        ))}
      </div>
    </div>
  );
} 