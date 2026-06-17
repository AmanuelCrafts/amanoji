'use client';

import { useEffect, useRef } from 'react';

const IMG_BASE = 'https://image.tmdb.org/t/p';

interface DetailData {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  runtime?: number;
  number_of_seasons?: number;
  overview?: string;
  backdrop_path?: string;
  genres?: { id: number; name: string }[];
  credits?: { cast?: { id: number; name: string }[] };
}

export default function DetailModal({
  data,
  type,
  onClose,
  onWatch,
}: {
  data: DetailData | null;
  type: string;
  onClose: () => void;
  onWatch: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!data) return null;

  const title = type === 'movie' ? data.title : data.name;
  const year = ((type === 'movie' ? data.release_date : data.first_air_date) || '').split('-')[0];
  const rating = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';
  const runtime = data.runtime ? data.runtime + ' min' : '';
  const seasons = data.number_of_seasons ? data.number_of_seasons + ' seasons' : '';
  const backdrop = data.backdrop_path ? `${IMG_BASE}/w1280${data.backdrop_path}` : '';
  const genres = (data.genres || []).slice(0, 3).map((g) => g.name).join(', ');
  const cast = (data.credits?.cast || []).slice(0, 8);

  const emoji = type === 'movie' ? '\uD83C\uDFAC' : '\uD83D\uDCFA';

  const metaParts = [emoji];
  if (year) metaParts.push('\uD83D\uDCC5 ' + year);
  metaParts.push('\u2B50 ' + rating);
  if (runtime) metaParts.push('\u23F1 ' + runtime);
  if (seasons) metaParts.push('\uD83D\uDCC1 ' + seasons);
  if (genres) metaParts.push(genres);

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${title}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" ref={modalRef} tabIndex={-1}>
        <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <div
          className="modal-bg"
          style={{ backgroundImage: backdrop ? `url(${backdrop})` : undefined }}
          role="img"
          aria-label={`${title} backdrop`}
        />
        <div className="modal-body">
          <h2>{title}</h2>
          <div className="modal-meta">{metaParts.join('  \u2022  ')}</div>
          {data.overview && <p className="modal-desc">{data.overview}</p>}
          {cast.length > 0 && (
            <div className="modal-cast">
              {cast.map((p) => (
                <span key={p.id}>{'\uD83C\uDFA5'} {p.name}</span>
              ))}
            </div>
          )}
          <button className="btn-play modal-watch" onClick={onWatch} aria-label={`Watch ${title}`}>
            {'\u25B6'} Watch Now
          </button>
        </div>
      </div>
    </div>
  );
}
