'use client';

import { useState, useTransition } from 'react';
import { addToFavorites, removeFromFavorites } from '@/app/actions/favorites';

/**
 * お気に入りボタンのプロパティ
 */
export interface FavoriteButtonProps {
  placeId: string;
  isFavorite: boolean;
}

/**
 * お気に入りボタンコンポーネント（クライアントコンポーネント）
 */
export function FavoriteButton({ placeId, isFavorite }: FavoriteButtonProps) {
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      try {
        if (isCurrentlyFavorite) {
          const result = await removeFromFavorites(placeId);
          if (result.success) {
            setIsCurrentlyFavorite(false);
          }
        } else {
          const result = await addToFavorites(placeId);
          if (result.success) {
            setIsCurrentlyFavorite(true);
          }
        }
      } catch (error) {
        console.error('Favorite toggle error:', error);
      }
    });
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isPending}
      className={`p-2 rounded-full transition-colors ${
        isPending 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-gray-100'
      } ${
        isCurrentlyFavorite 
          ? 'text-red-500' 
          : 'text-gray-400 hover:text-red-500'
      }`}
      title={isCurrentlyFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      {isCurrentlyFavorite ? '❤️' : '🤍'}
    </button>
  );
} 