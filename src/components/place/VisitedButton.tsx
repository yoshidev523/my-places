'use client';

import { useState, useTransition } from 'react';
import { addToVisited, removeFromVisited } from '@/app/actions/visited';

/**
 * 訪問ボタンのプロパティ
 */
export interface VisitedButtonProps {
  placeId: string;
  isVisited: boolean;
}

/**
 * 訪問ボタンコンポーネント（クライアントコンポーネント）
 */
export function VisitedButton({ placeId, isVisited }: VisitedButtonProps) {
  const [isCurrentlyVisited, setIsCurrentlyVisited] = useState(isVisited);
  const [isPending, startTransition] = useTransition();

  const handleToggleVisited = () => {
    startTransition(async () => {
      try {
        if (isCurrentlyVisited) {
          const result = await removeFromVisited(placeId);
          if (result.success) {
            setIsCurrentlyVisited(false);
          }
        } else {
          const result = await addToVisited(placeId);
          if (result.success) {
            setIsCurrentlyVisited(true);
          }
        }
      } catch (error) {
        console.error('Visited toggle error:', error);
      }
    });
  };

  return (
    <button
      onClick={handleToggleVisited}
      disabled={isPending}
      className={`p-2 rounded-full transition-colors ${
        isPending 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-gray-100'
      } ${
        isCurrentlyVisited 
          ? 'text-green-500' 
          : 'text-gray-400 hover:text-green-500'
      }`}
      title={isCurrentlyVisited ? '訪問済みフラグを削除' : '訪問済みにマーク'}
    >
      {isCurrentlyVisited ? '✓' : '○'}
    </button>
  );
} 