import { Header, SearchForm, SearchResults } from '@/components';
import { getSearchResults } from './actions/searchPlaces';

/**
 * トップページコンポーネント
 * @param searchParams URL検索パラメータ
 */
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
  let places = null;
  let error = null;

  // 検索クエリがある場合は検索を実行
  if (query) {
    try {
      places = await getSearchResults(query);
      if (places === null) {
        error = 'APIキーが設定されていないか、検索中にエラーが発生しました';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : '検索中にエラーが発生しました';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <SearchForm />
        <SearchResults places={places} query={query} error={error} />
      </main>
    </div>
  );
}
