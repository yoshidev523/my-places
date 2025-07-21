/**
 * 星評価のプロパティ
 */
export interface StarRatingProps {
  rating: number;
  count?: number;
}

/**
 * 星評価を表示するコンポーネント
 */
export function StarRating({ rating, count }: StarRatingProps) {
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