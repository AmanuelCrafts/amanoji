'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchHero() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function doSearch() {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="hero" aria-label="Search and browse movies">
      <div className="hero-center" style={{ maxWidth: 680 }}>
        <h1 className="hero-heading">
          <span>{'\uD83C\uDFAC'}</span> Watch Anything <span>{'\uD83D\uDD25'}</span>
        </h1>
        <p className="hero-sub">
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
            onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
          />
          <button onClick={doSearch} aria-label="Search">{'\uD83D\uDD0D'} Search</button>
        </div>
      </div>
    </section>
  );
}
