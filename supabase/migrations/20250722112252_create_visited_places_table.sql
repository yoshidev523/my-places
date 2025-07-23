-- 訪問済みPOI情報を保存するテーブル
CREATE TABLE IF NOT EXISTS public.visited_places (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- 主キー
    place_id VARCHAR(255) NOT NULL UNIQUE,  -- Google Places APIのplace_id
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- 作成日時
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()  -- 更新日時
);

-- updated_atの自動更新トリガーを作成
CREATE TRIGGER update_visited_places_updated_at 
    BEFORE UPDATE ON visited_places 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
