'use client';

import { useState } from 'react';
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

interface Props {
  query: string;
  initialResults: SearchItem[];
}

export default function SearchResults({ query, initialResults }: Props) {
  const [detailData, setDetailData] = useState<any>(null);
  const [detailType, setDetailType] = useState('');
  const [playerItem, setPlayerItem] = useState<any>(null);
  const [playerType, setPlayerType] = useState('');

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

  return (
    <>
      <div className="hero-center" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 className="results-header">
          {'\uD83D\uDD0D'} Results for &ldquo;{query}&rdquo;
        </h2>

        {initialResults.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 32 }}>
            {'\uD83D\uDE14'} No results for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <div className="results-grid" role="list">
            {initialResults.map((item) => {
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
        )}
      </div>

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
