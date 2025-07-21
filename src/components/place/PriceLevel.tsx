/**
 * 価格レベルのプロパティ
 */
export interface PriceLevelProps {
  level?: number;
}

/**
 * 価格レベルを表示するコンポーネント
 */
export function PriceLevel({ level }: PriceLevelProps) {
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