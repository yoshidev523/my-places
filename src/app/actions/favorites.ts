'use server';

import { FavoritesRepository } from '@/repositories/favoritesRepository';
import { createPlacesRepository } from '@/repositories/placesRepository';
import { Place } from '@/types';
import { revalidatePath } from 'next/cache';

const favoritesRepository = new FavoritesRepository();

/**
 * お気に入りに追加するサーバーアクション
 * @param placeId Google Places APIのplace_id
 * @returns 成功時は成功メッセージ、失敗時はエラーメッセージ
 */
export async function addToFavorites(placeId: string) {
  try {
    await favoritesRepository.addFavorite(placeId);
    revalidatePath('/');
    revalidatePath('/favorites');
    return { success: true, message: 'お気に入りに追加しました' };
  } catch (error) {
    console.error('Add to favorites error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'お気に入りの追加に失敗しました' 
    };
  }
}

/**
 * お気に入りから削除するサーバーアクション
 * @param placeId Google Places APIのplace_id
 * @returns 成功時は成功メッセージ、失敗時はエラーメッセージ
 */
export async function removeFromFavorites(placeId: string) {
  try {
    await favoritesRepository.removeFavorite(placeId);
    revalidatePath('/');
    revalidatePath('/favorites');
    return { success: true, message: 'お気に入りから削除しました' };
  } catch (error) {
    console.error('Remove from favorites error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'お気に入りの削除に失敗しました' 
    };
  }
}

/**
 * お気に入り状態をチェックするサーバーアクション
 * @param placeId Google Places APIのplace_id
 * @returns お気に入りに登録されているかの真偽値
 */
export async function checkFavoriteStatus(placeId: string): Promise<boolean> {
  try {
    return await favoritesRepository.isFavorite(placeId);
  } catch (error) {
    console.error('Check favorite status error:', error);
    return false;
  }
}

/**
 * お気に入り一覧とそれらの詳細情報を取得するサーバーアクション
 * @returns お気に入りのPlace一覧、またはエラーメッセージ
 */
export async function getFavoritePlaces(): Promise<{
  success: boolean;
  places?: Place[];
  error?: string;
}> {
  try {
    // お気に入り一覧を取得
    const favoritesList = await favoritesRepository.getFavorites();
    
    if (favoritesList.length === 0) {
      return { success: true, places: [] };
    }

    // Google Maps APIキーを取得
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }

    // Places APIから詳細情報を取得
    const placesRepository = createPlacesRepository(apiKey);
    const placeIds = favoritesList.map(fav => fav.place_id);
    const places = await placesRepository.getPlacesDetails(placeIds);

    return { success: true, places };
  } catch (error) {
    console.error('Failed to get favorite places:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'お気に入りの取得に失敗しました' 
    };
  }
}

/**
 * 複数のplace_idの中でお気に入りに登録されているものを取得するサーバーアクション
 * @param placeIds place_idの配列
 * @returns お気に入りに登録されているplace_idの配列
 */
export async function getFavoriteStatuses(placeIds: string[]): Promise<string[]> {
  try {
    return await favoritesRepository.getFavoriteStatuses(placeIds);
  } catch (error) {
    console.error('Failed to get favorite statuses:', error);
    return [];
  }
} 