import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const tvId = req.nextUrl.searchParams.get('tvId');
  const season = req.nextUrl.searchParams.get('season');
  if (!tvId || !season) {
    return NextResponse.json({ episodes: [] });
  }
  try {
    const res = await fetch(
      `${TMDB_BASE}/tv/${tvId}/season/${season}?api_key=${TMDB_KEY}`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) {
      return NextResponse.json({ episodes: [] }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ episodes: [] }, { status: 500 });
  }
}
