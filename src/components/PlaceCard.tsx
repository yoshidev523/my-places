import { Place } from '@/types';

/**
 * 個別の場所を表示するカードコンポーネント
 */
export interface PlaceCardProps {
  place: Place;
}

/**
 * 星評価を表示するコンポーネント
 */
function StarRating({ rating, count }: { rating: number; count?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < fullStars) {
            return <span key={i} className="text-yellow-400">★</span>;
          } else if (i === fullStars && hasHalfStar) {
            return <span key={i} className="text-yellow-400">☆</span>;
          } else {
            return <span key={i} className="text-gray-300">☆</span>;
          }
        })}
      </div>
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)} {count && `(${count}件)`}
      </span>
    </div>
  );
}

/**
 * 営業時間の状態を表示するコンポーネント
 */
function OpeningStatus({ openingHours }: { openingHours?: Place['opening_hours'] }) {
  if (!openingHours) {
    return <span className="text-gray-500">営業時間情報なし</span>;
  }

  const isOpen = openingHours.open_now;
  const statusText = isOpen ? '営業中' : '営業時間外';
  const statusColor = isOpen ? 'text-green-600' : 'text-red-600';

  return (
    <div>
      <span className={`font-medium ${statusColor}`}>
        {statusText}
      </span>
      {openingHours.weekday_text && (
        <div className="mt-1">
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer hover:text-gray-800">
              営業時間を見る
            </summary>
            <div className="mt-2 space-y-1">
              {openingHours.weekday_text.map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

/**
 * 価格レベルを表示するコンポーネント
 */
function PriceLevel({ level }: { level?: number }) {
  if (level === undefined) return null;

  const getPriceText = (level: number) => {
    switch (level) {
      case 0:
        return { text: '無料', symbol: '無料' };
      case 1:
        return { text: '安い', symbol: '¥' };
      case 2:
        return { text: '普通', symbol: '¥¥' };
      case 3:
        return { text: '高い', symbol: '¥¥¥' };
      case 4:
        return { text: 'とても高い', symbol: '¥¥¥¥' };
      default:
        return { text: '不明', symbol: '?' };
    }
  };

  const priceInfo = getPriceText(level);

  return (
    <div className="flex items-center gap-2">
      <span className="text-green-600 font-medium">{priceInfo.symbol}</span>
      <span className="text-sm text-gray-600">{priceInfo.text}</span>
    </div>
  );
}

/**
 * 場所カードコンポーネント
 */
export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* 場所名 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {place.name}
          </h3>
          {place.types && place.types.length > 0 && (
            <div className="mt-1">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {place.types[0].replace(/_/g, ' ')}
              </span>
            </div>
          )}
        </div>

        {/* 住所 */}
        <div>
          <p className="text-gray-600 flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">📍</span>
            {place.formatted_address}
          </p>
        </div>

        {/* 評価と価格レベル */}
        <div className="flex items-center justify-between">
          {place.rating && (
            <div>
              <StarRating rating={place.rating} count={place.user_ratings_total} />
            </div>
          )}
          <PriceLevel level={place.price_level} />
        </div>

        {/* 営業時間 */}
        <div>
          <OpeningStatus openingHours={place.opening_hours} />
        </div>
      </div>
    </div>
  );
} 