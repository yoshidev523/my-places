/**
 * Google Places API関連の型定義（@googlemaps/google-maps-services-js用）
 */

/**
 * 場所の基本情報（Google Maps Services互換）
 */
export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: PlaceOpeningHours;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: PlacePhoto[];
  price_level?: number;
  types?: string[];
  business_status?: string;
}

/**
 * 営業時間情報
 */
export interface PlaceOpeningHours {
  open_now?: boolean;
  periods?: OpeningPeriod[];
  weekday_text?: string[];
}

/**
 * 営業時間の期間
 */
export interface OpeningPeriod {
  open: OpeningHoursTime;
  close?: OpeningHoursTime;
}

/**
 * 営業時間
 */
export interface OpeningHoursTime {
  day: number; // 0-6 (Sunday-Saturday)
  time: string; // HHMM format
}

/**
 * 場所の写真
 */
export interface PlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
  html_attributions: string[];
}

/**
 * 検索パラメータ
 */
export interface SearchPlacesParams {
  query: string;
  location?: {
    lat: number;
    lng: number;
  };
  radius?: number;
  type?: string;
  language?: string;
  region?: string;
}
 