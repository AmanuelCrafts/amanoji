import Navbar from '../components/Navbar';
import SearchResults from '../components/SearchResults';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

interface SearchItem {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  poster_path?: string | null;
}

async function fetchResults(q: string): Promise<SearchItem[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&page=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).filter(
      (r: any) => r.media_type === 'movie' || r.media_type === 'tv'
    );
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || '';
  const results = q.length >= 2 ? await fetchResults(q) : [];

  return (
    <>
      <Navbar />
      <section className="hero has-results" aria-label="Search results">
        <SearchResults query={q} initialResults={results} />
      </section>
      <footer className="footer">
        <p><a href="https://github.com/AmanuelCrafts" target="_blank" rel="noopener noreferrer">{'\uD83D\uDCBB'} AmanuelCrafts</a></p>
      </footer>
    </>
  );
}
