'use server';

import { VisitedRepository } from '@/repositories/visitedRepository';
import { createPlacesRepository } from '@/repositories/placesRepository';
import { Place } from '@/types';
import { revalidatePath } from 'next/cache';

const visitedRepository = new VisitedRepository();

/**
 * 訪問場所に追加するサーバーアクション
 * @param placeId Google Places APIのplace_id
 * @returns 成功時は成功メッセージ、失敗時はエラーメッセージ
 */
export async function addToVisited(placeId: string) {
  try {
    await visitedRepository.addVisitedPlace(placeId);
    revalidatePath('/');
    revalidatePath('/visited');
    return { success: true, message: '訪問場所に追加しました' };
  } catch (error) {
    console.error('Add to visited error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '訪問場所の追加に失敗しました' 
    };
  }
}

/**
 * 訪問場所から削除するサーバーアクション
 * @param placeId Google Places APIのplace_id
 * @returns 成功時は成功メッセージ、失敗時はエラーメッセージ
 */
export async function removeFromVisited(placeId: string) {
  try {
    await visitedRepository.removeVisitedPlace(placeId);
    revalidatePath('/');
    revalidatePath('/visited');
    return { success: true, message: '訪問場所から削除しました' };
  } catch (error) {
    console.error('Remove from visited error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '訪問場所の削除に失敗しました' 
    };
  }
}

/**
 * 訪問場所状態をチェックするサーバーアクション
 * @param placeId Google Places APIのplace_id
 * @returns 訪問場所に登録されているかの真偽値
 */
export async function checkVisitedStatus(placeId: string): Promise<boolean> {
  try {
    return await visitedRepository.isVisited(placeId);
  } catch (error) {
    console.error('Check visited status error:', error);
    return false;
  }
}

/**
 * 訪問場所一覧とそれらの詳細情報を取得するサーバーアクション
 * @returns 訪問場所のPlace一覧、またはエラーメッセージ
 */
export async function getVisitedPlaces(): Promise<{
  success: boolean;
  places?: Place[];
  error?: string;
}> {
  try {
    // 訪問場所一覧を取得
    const visitedList = await visitedRepository.getVisitedPlaces();
    
    if (visitedList.length === 0) {
      return { success: true, places: [] };
    }

    // Google Maps APIキーを取得
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }

    // Places APIから詳細情報を取得
    const placesRepository = createPlacesRepository(apiKey);
    const placeIds = visitedList.map(visited => visited.place_id);
    const places = await placesRepository.getPlacesDetails(placeIds);

    return { success: true, places };
  } catch (error) {
    console.error('Failed to get visited places:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '訪問場所の取得に失敗しました' 
    };
  }
}

/**
 * 複数のplace_idの中で訪問場所に登録されているものを取得するサーバーアクション
 * @param placeIds place_idの配列
 * @returns 訪問場所に登録されているplace_idの配列
 */
export async function getVisitedStatuses(placeIds: string[]): Promise<string[]> {
  try {
    return await visitedRepository.getVisitedStatuses(placeIds);
  } catch (error) {
    console.error('Failed to get visited statuses:', error);
    return [];
  }
} 