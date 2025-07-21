'use server';

import { SearchPlacesParams, Place } from '@/types';
import { createPlacesRepository } from '@/repositories';
import { redirect } from 'next/navigation';

/**
 * 場所を検索するサーバーアクション
 * @param formData フォームデータ
 */
export async function searchPlacesAction(formData: FormData): Promise<void> {
  const query = formData.get('query') as string;
  
  if (!query || query.trim().length === 0) {
    // 空のクエリの場合はホームページにリダイレクト
    redirect('/');
    return;
  }

  // 検索クエリをURLパラメータに含めてリダイレクト
  const encodedQuery = encodeURIComponent(query.trim());
  redirect(`/?query=${encodedQuery}`);
}

/**
 * 場所を検索する関数（サーバーサイド）
 * @param query 検索クエリ
 * @returns 検索結果または null（エラー時）
 */
export async function getSearchResults(query: string): Promise<Place[] | null> {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY is not set in environment variables');
      return null;
    }

    const params: SearchPlacesParams = {
      query: query.trim(),
      language: 'ja',
      region: 'JP',
    };

    const repository = createPlacesRepository(apiKey);
    const results = await repository.searchPlaces(params);
    
    return results;
  } catch (error) {
    console.error('Search places error:', error);
    return null;
  }
} 