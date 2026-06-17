'use client';

import { useState, useEffect, useCallback } from 'react';

const VIDKING_BASE = 'https://www.vidking.net/embed';
const PLAYER_COLOR = '8080cf';

interface PlayerItem {
  id: number;
  title?: string;
  name?: string;
}

export default function PlayerModal({
  item,
  type,
  onClose,
}: {
  item: PlayerItem | null;
  type: string;
  onClose: () => void;
}) {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasons, setSeasons] = useState(1);
  const [episodes, setEpisodes] = useState<{ num: number; name: string }[]>([]);
  const [src, setSrc] = useState('');

  const buildUrl = useCallback((s: number, e: number) => {
    if (!item) return;
    const id = item.id;
    if (type === 'movie') {
      setSrc(`${VIDKING_BASE}/movie/${id}?color=${PLAYER_COLOR}&autoPlay=true`);
    } else {
      setSrc(`${VIDKING_BASE}/tv/${id}/${s}/${e}?color=${PLAYER_COLOR}&autoPlay=true&nextEpisode=true&episodeSelector=true`);
    }
  }, [item, type]);

  useEffect(() => {
    if (!item) return;
    if (type === 'movie') {
      buildUrl(1, 1);
      return;
    }
    fetch(`/api/details?type=tv&id=${item.id}`)
      .then((r) => r.json())
      .then((data) => {
        const s = data.number_of_seasons || 1;
        setSeasons(s);
        setSeason(1);
        fetchEpisodes(item.id, 1);
      });
  }, [item, type, buildUrl]);

  function fetchEpisodes(tvId: number, s: number) {
    fetch(`/api/season?tvId=${tvId}&season=${s}`)
      .then((r) => r.json())
      .then((data) => {
        const eps = (data.episodes || []).map((ep: any) => ({
          num: ep.episode_number,
          name: ep.name || `Episode ${ep.episode_number}`,
        }));
        setEpisodes(eps);
        if (eps.length > 0) {
          setEpisode(eps[0].num);
          setTimeout(() => buildUrl(s, eps[0].num), 0);
        }
      });
  }

  function handleSeasonChange(s: number) {
    setSeason(s);
    if (item) fetchEpisodes(item.id, s);
  }

  function handleEpisodeChange(e: number) {
    setEpisode(e);
    buildUrl(season, e);
  }

  if (!item) return null;

  const title = type === 'movie' ? (item.title || item.name) : item.name;

  return (
    <div className="player-overlay open">
      <div className="player-container">
        <button className="player-close" onClick={onClose}>&times;</button>
        <div className="player-wrapper">
          <iframe
            src={src}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="player-info">
          <h3>{'\uD83D\uDCFA'} {title}</h3>
          {type !== 'movie' && (
            <div className="player-controls">
              <select
                value={season}
                onChange={(e) => handleSeasonChange(Number(e.target.value))}
              >
                {Array.from({ length: seasons }, (_, i) => i + 1).map((s) => (
                  <option key={s} value={s}>
                    {'\uD83D\uDCC1'} Season {s}
                  </option>
                ))}
              </select>
              <select
                value={episode}
                onChange={(e) => handleEpisodeChange(Number(e.target.value))}
              >
                {episodes.map((ep) => (
                  <option key={ep.num} value={ep.num}>
                    {'\u25B6'} E{ep.num} - {ep.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
