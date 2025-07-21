import { Place } from '@/types';
import { FavoriteButton } from './FavoriteButton';
import { StarRating } from './StarRating';
import { OpeningStatus } from './OpeningStatus';
import { PriceLevel } from './PriceLevel';

/**
 * 個別の場所を表示するカードコンポーネントのプロパティ
 */
export interface PlaceCardProps {
  place: Place;
  isFavorite?: boolean;
}

/**
 * 場所カードコンポーネント（サーバーコンポーネント）
 */
export function PlaceCard({ place, isFavorite = false }: PlaceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* ヘッダー（場所名とお気に入りボタン） */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
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
          <FavoriteButton placeId={place.place_id} isFavorite={isFavorite} />
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