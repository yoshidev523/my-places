import { supabase } from '@/lib/supabase';
import { Database, TablesInsert } from '@/types/supabase';

type VisitedPlace = Database['public']['Tables']['visited_places']['Row'];
type VisitedPlaceInsert = TablesInsert<'visited_places'>;

/**
 * 訪問場所管理用リポジトリクラス
 */
export class VisitedRepository {
  /**
   * 訪問場所一覧を取得
   * @returns 訪問場所POI一覧
   */
  async getVisitedPlaces(): Promise<VisitedPlace[]> {
    const { data, error } = await supabase
      .from('visited_places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch visited places:', error);
      throw new Error('訪問場所の取得に失敗しました');
    }

    return data || [];
  }

  /**
   * 訪問場所に追加
   * @param placeId Google Places APIのplace_id
   * @returns 追加された訪問場所POI
   */
  async addVisitedPlace(placeId: string): Promise<VisitedPlace> {
    const insertData: VisitedPlaceInsert = {
      place_id: placeId,
    };

    const { data, error } = await supabase
      .from('visited_places')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Failed to add visited place:', error);
      throw new Error('訪問場所の追加に失敗しました');
    }

    return data;
  }

  /**
   * 訪問場所から削除
   * @param placeId Google Places APIのplace_id
   */
  async removeVisitedPlace(placeId: string): Promise<void> {
    const { error } = await supabase
      .from('visited_places')
      .delete()
      .eq('place_id', placeId);

    if (error) {
      console.error('Failed to remove visited place:', error);
      throw new Error('訪問場所の削除に失敗しました');
    }
  }

  /**
   * 指定したplace_idが訪問場所に登録されているかチェック
   * @param placeId Google Places APIのplace_id
   * @returns 訪問場所に登録されている場合はtrue
   */
  async isVisited(placeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('visited_places')
      .select('id')
      .eq('place_id', placeId)
      .limit(1);

    if (error) {
      console.error('Failed to check visited status:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  }

  /**
   * 複数のplace_idの中で訪問場所に登録されているものを取得
   * @param placeIds Google Places APIのplace_idの配列
   * @returns 訪問場所に登録されているplace_idの配列
   */
  async getVisitedStatuses(placeIds: string[]): Promise<string[]> {
    if (placeIds.length === 0) return [];

    const { data, error } = await supabase
      .from('visited_places')
      .select('place_id')
      .in('place_id', placeIds);

    if (error) {
      console.error('Failed to get visited statuses:', error);
      return [];
    }

    return data?.map(item => item.place_id) || [];
  }
} 