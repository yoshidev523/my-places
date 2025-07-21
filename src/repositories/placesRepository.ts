import { Client, PlaceData, Language, TextSearchRequest, LatLng, PlaceType1 } from '@googlemaps/google-maps-services-js';
import { SearchPlacesParams, Place } from '@/types';

/**
 * Google Places APIを呼び出すリポジトリクラス（サーバーサイド版）
 */
export class PlacesRepository {
  private client: Client;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Client({});
  }

  /**
   * テキスト検索を実行して場所を検索する
   * @param params 検索パラメータ
   * @returns 検索結果のPromise
   */
  async searchPlaces(params: SearchPlacesParams): Promise<Place[]> {
    try {
      const requestParams: TextSearchRequest['params'] = {
        query: params.query,
        key: this.apiKey,
        language: (params.language || 'ja') as Language,
        region: params.region || 'JP',
        ...(params.location && {
          location: `${params.location.lat},${params.location.lng}` as LatLng,
          radius: params.radius || 5000,
        }),
        ...(params.type && { type: params.type as PlaceType1 }),
      };

      const response = await this.client.textSearch({
        params: requestParams,
        timeout: 5000, // 5秒タイムアウト
      });

      if (response.data.status === 'OK' && response.data.results) {
        return response.data.results
          .filter((result): result is PlaceData => result.place_id !== undefined)
          .map((result) => this.transformPlaceResult(result));
      } else if (response.data.status === 'ZERO_RESULTS') {
        return [];
      } else {
        throw new Error(`Places API Error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search places: ${error.message}`);
      }
      throw new Error('Unknown error occurred while searching places');
    }
  }

  /**
   * 場所の詳細情報を取得する
   * @param placeId 場所ID
   * @returns 詳細情報のPromise
   */
  async getPlaceDetails(placeId: string): Promise<Place | null> {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'rating',
            'user_ratings_total',
            'opening_hours',
            'geometry',
            'photos',
            'price_level',
            'types',
            'business_status'
          ],
          language: 'ja' as Language,
        },
        timeout: 5000,
      });

      if (response.data.status === 'OK' && response.data.result && response.data.result.place_id) {
        return this.transformPlaceResult(response.data.result as PlaceData);
      } else if (response.data.status === 'NOT_FOUND') {
        return null;
      } else {
        throw new Error(`Place details request failed: ${response.data.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get place details: ${error.message}`);
      }
      throw new Error('Unknown error occurred while getting place details');
    }
  }

  /**
   * APIレスポンスを内部型に変換する
   * @param result APIレスポンスの結果
   * @returns 変換された場所情報
   * @private
   */
  private transformPlaceResult(result: PlaceData): Place {
    return {
      place_id: result.place_id || '',
      name: result.name || '',
      formatted_address: result.formatted_address || '',
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      opening_hours: result.opening_hours ? {
        open_now: result.opening_hours.open_now,
        weekday_text: result.opening_hours.weekday_text,
      } : undefined,
      geometry: {
        location: {
          lat: result.geometry?.location?.lat || 0,
          lng: result.geometry?.location?.lng || 0,
        },
      },
      photos: result.photos?.map(photo => ({
        height: photo.height,
        width: photo.width,
        photo_reference: photo.photo_reference,
        html_attributions: photo.html_attributions,
      })),
      price_level: result.price_level,
      types: result.types,
      business_status: result.business_status,
    };
  }
}

/**
 * Places Repositoryのインスタンスを作成する
 * @param apiKey Google Maps APIキー
 * @returns PlacesRepositoryインスタンス
 */
export const createPlacesRepository = (apiKey: string): PlacesRepository => {
  return new PlacesRepository(apiKey);
}; 