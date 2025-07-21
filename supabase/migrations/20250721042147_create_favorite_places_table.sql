-- お気に入りPOI情報を保存するテーブル
CREATE TABLE IF NOT EXISTS public.favorite_places (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- 主キー
    place_id VARCHAR(255) NOT NULL UNIQUE,  -- Google Places APIのplace_id
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- 作成日時
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()  -- 更新日時
);

-- updated_at自動更新関数を作成（存在しない場合のみ）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atの自動更新トリガーを作成
CREATE TRIGGER update_favorite_places_updated_at 
    BEFORE UPDATE ON favorite_places 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
