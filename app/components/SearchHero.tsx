'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import DetailModal from './DetailModal';
import PlayerModal from './PlayerModal';

const IMG_BASE = 'https://image.tmdb.org/t/p';

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

export default function SearchHero() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const [detailData, setDetailData] = useState<any>(null);
  const [detailType, setDetailType] = useState('');
  const [playerItem, setPlayerItem] = useState<any>(null);
  const [playerType, setPlayerType] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q && q.length >= 2) {
      setQuery(q);
      doSearch(q);
    }
  }, []);

  function pushUrl(q: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('q', q);
    window.history.replaceState({}, '', url.toString());
  }

  const resetView = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setError('');
    setDetailData(null);
    setPlayerItem(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  async function doSearch(q: string) {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;

    pushUrl(trimmed);
    setLoading(true);
    setError('');
    setHasSearched(true);
    setResults([]);
    setDetailData(null);
    setPlayerItem(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        setError('Search API error. Try again.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      const items = (data.results || []).filter(
        (r: any) => r.media_type === 'movie' || r.media_type === 'tv'
      );
      setResults(items);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function openDetail(item: SearchItem) {
    setDetailData(null);
    fetch(`/api/details?type=${item.media_type}&id=${item.id}`)
      .then((r) => r.json())
      .then((data) => {
        setDetailData(data);
        setDetailType(item.media_type);
      });
  }

  function openPlayer() {
    if (detailData) {
      setPlayerItem(detailData);
      setPlayerType(detailType);
      setDetailData(null);
    }
  }

  function yearStr(item: SearchItem) {
    const d = item.media_type === 'movie' ? item.release_date : item.first_air_date;
    return d ? d.split('-')[0] : '';
  }

  function ratingStr(item: SearchItem) {
    return item.vote_average ? '\u2B50 ' + item.vote_average.toFixed(1) : '';
  }

  const showSearch = !hasSearched || (!loading && results.length === 0 && !error);

  return (
    <>
      <section className={`hero ${hasSearched && !showSearch ? 'has-results' : ''}`} aria-label="Search and browse movies">
        <div className="hero-center">
          <h1 className="hero-heading" style={{ display: hasSearched ? 'none' : '' }}>
            <span>{'\uD83C\uDFAC'}</span> Watch Anything <span>{'\uD83D\uDD25'}</span>
          </h1>
          <p className="hero-sub" style={{ display: hasSearched ? 'none' : '' }}>
            Search movies &amp; TV shows &mdash; Thank me Later!
          </p>

          <div className="hero-search" role="search">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies & TV shows..."
              aria-label="Search for movies or TV shows"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') doSearch(query); }}
            />
            <button onClick={() => doSearch(query)} aria-label="Search">{'\uD83D\uDD0D'} Search</button>
          </div>

          <div className={`loading-spinner ${loading ? 'show' : ''}`} role="status" aria-label="Loading results" />

          {error && <p className="error-msg" role="alert">{error}</p>}

          {hasSearched && !loading && results.length > 0 && (
            <>
              <h2 className="results-header">
                {'\uD83D\uDD0D'} Results for &ldquo;{query}&rdquo;
              </h2>

              <div className="ad-container">
                <ins className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-6168141382402894"
                  data-ad-slot="YOUR_SLOT_ID"
                  data-ad-format="auto"
                  data-full-width-responsive="true" />
              </div>

              <div className="results-grid" role="list">
                {results.map((item, i) => {
                  const title = item.media_type === 'movie' ? item.title : item.name;
                  const year = yearStr(item);
                  const imgSrc = item.poster_path
                    ? `${IMG_BASE}/w342${item.poster_path}`
                    : null;
                  const typeLabel =
                    item.media_type === 'movie' ? '\uD83C\uDFAC MOVIE' : '\uD83D\uDCFA TV';

                  return (
                    <div
                      key={`${item.media_type}-${item.id}`}
                      className="result-card"
                      role="listitem"
                      onClick={() => openDetail(item)}
                    >
                      {imgSrc ? (
                        <img
                          className="result-card-img"
                          src={imgSrc}
                          alt={title || ''}
                          loading="lazy"
                        />
                      ) : (
                        <div className="result-card-img-placeholder" aria-hidden="true">{'\uD83C\uDF7F'}</div>
                      )}
                      <div className="result-card-type">{typeLabel}</div>
                      <div className="result-card-title">{title}</div>
                      {(year || item.vote_average) && (
                        <div className="result-card-meta">
                          {year && <>{'\uD83D\uDCC5'} {year}</>}
                          {year && item.vote_average ? <>  </> : null}
                          {item.vote_average ? <>{ratingStr(item)}</> : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="ad-container ad-leaderboard">
                <ins className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-6168141382402894"
                  data-ad-slot="YOUR_SLOT_ID"
                  data-ad-format="auto"
                  data-full-width-responsive="true" />
              </div>
            </>
          )}

          {hasSearched && !loading && results.length === 0 && !error && (
            <p style={{ color: 'var(--text-muted)', marginTop: '32px', fontSize: '1rem' }}>
              {'\uD83D\uDE14'} No results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </section>

      {detailData && (
        <DetailModal
          data={detailData}
          type={detailType}
          onClose={() => setDetailData(null)}
          onWatch={openPlayer}
        />
      )}

      {playerItem && (
        <PlayerModal
          item={playerItem}
          type={playerType}
          onClose={() => {
            setPlayerItem(null);
            setPlayerType('');
          }}
        />
      )}
    </>
  );
}
