import { Place } from '@/types';

/**
 * 営業時間状態のプロパティ
 */
export interface OpeningStatusProps {
  openingHours?: Place['opening_hours'];
}

/**
 * 営業時間の状態を表示するコンポーネント
 */
export function OpeningStatus({ openingHours }: OpeningStatusProps) {
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