import { supabase } from '@/lib/supabase';
import { Database, TablesInsert } from '@/types/supabase';

type FavoritePlace = Database['public']['Tables']['favorite_places']['Row'];
type FavoritePlaceInsert = TablesInsert<'favorite_places'>;

/**
 * お気に入りPOI管理用リポジトリクラス
 */
export class FavoritesRepository {
  /**
   * お気に入り一覧を取得
   * @returns お気に入りPOI一覧
   */
  async getFavorites(): Promise<FavoritePlace[]> {
    const { data, error } = await supabase
      .from('favorite_places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch favorites:', error);
      throw new Error('お気に入りの取得に失敗しました');
    }

    return data || [];
  }

  /**
   * お気に入りに追加
   * @param placeId Google Places APIのplace_id
   * @returns 追加されたお気に入りPOI
   */
  async addFavorite(placeId: string): Promise<FavoritePlace> {
    const insertData: FavoritePlaceInsert = {
      place_id: placeId,
    };

    const { data, error } = await supabase
      .from('favorite_places')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Failed to add favorite:', error);
      throw new Error('お気に入りの追加に失敗しました');
    }

    return data;
  }

  /**
   * お気に入りから削除
   * @param placeId Google Places APIのplace_id
   */
  async removeFavorite(placeId: string): Promise<void> {
    const { error } = await supabase
      .from('favorite_places')
      .delete()
      .eq('place_id', placeId);

    if (error) {
      console.error('Failed to remove favorite:', error);
      throw new Error('お気に入りの削除に失敗しました');
    }
  }

  /**
   * 指定したplace_idがお気に入りに登録されているかチェック
   * @param placeId Google Places APIのplace_id
   * @returns お気に入りに登録されている場合はtrue
   */
  async isFavorite(placeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorite_places')
      .select('id')
      .eq('place_id', placeId)
      .limit(1);

    if (error) {
      console.error('Failed to check favorite status:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  }

  /**
   * 複数のplace_idの中でお気に入りに登録されているものを取得
   * @param placeIds Google Places APIのplace_idの配列
   * @returns お気に入りに登録されているplace_idの配列
   */
  async getFavoriteStatuses(placeIds: string[]): Promise<string[]> {
    if (placeIds.length === 0) return [];

    const { data, error } = await supabase
      .from('favorite_places')
      .select('place_id')
      .in('place_id', placeIds);

    if (error) {
      console.error('Failed to get favorite statuses:', error);
      return [];
    }

    return data?.map(item => item.place_id) || [];
  }
} 