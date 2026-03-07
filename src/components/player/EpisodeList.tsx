'use client';

import React, { useEffect, useState } from 'react';
import { useEpisodePlayer, Episode } from '@/context/EpisodePlayerContext';
import { Play, Pause, Lock, Headphones } from 'lucide-react';

interface EpisodeListProps {
  subject?: string;
  chapterId?: string;
  limit?: number;
  showTitle?: boolean;
}

export default function EpisodeList({
  subject,
  chapterId,
  limit = 20,
  showTitle = true,
}: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentEpisode, isPlaying, playEpisode, pause, resume } =
    useEpisodePlayer();

  useEffect(() => {
    async function fetchEpisodes() {
      setLoading(true);
      try {
        // Use server-side API route to bypass India Supabase block
        const res = await fetch('/api/episodes/public');
        if (!res.ok) {
          console.error('Failed to fetch episodes:', res.status);
          setLoading(false);
          return;
        }
        const data = await res.json();
        let episodeList = data.episodes || [];

        // Client-side filtering (API returns all episodes)
        if (subject) {
          episodeList = episodeList.filter((ep: any) => ep.subject === subject);
        }
        if (chapterId) {
          episodeList = episodeList.filter((ep: any) => ep.chapter_id === chapterId);
        }

        // Sort by order_index and limit
        episodeList.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
        episodeList = episodeList.slice(0, limit);

        const mapped: Episode[] = episodeList.map((ep: any) => ({
          id: ep.id,
          title: ep.title,
          description: ep.description,
          subject: ep.subject,
          chapter_id: ep.chapter_id,
          youtube_video_id: ep.audio_url,
          duration_seconds: ep.duration_seconds,
          is_free: ep.is_free ?? true,
          order_index: ep.order_index,
        }));

        setEpisodes(mapped);
      } catch (err) {
        console.error('Failed to fetch episodes:', err);
      }
      setLoading(false);
    }

    fetchEpisodes();
  }, [subject, chapterId, limit]);

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleEpisodeClick(episode: Episode) {
    if (currentEpisode?.id === episode.id) {
      isPlaying ? pause() : resume();
    } else {
      playEpisode(episode);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading episodes...
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No episodes available yet. Coming soon!
      </div>
    );
  }

  return (
    <div>
      {showTitle && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <Headphones size={20} style={{ color: '#c41e1e' }} />
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            Summit Neuro Episodes
          </h2>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {episodes.map((episode, index) => {
          const isActive = currentEpisode?.id === episode.id;
          const isCurrentlyPlaying = isActive && isPlaying;

          return (
            <button
              key={episode.id}
              onClick={() => handleEpisodeClick(episode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: isActive ? '#fef2f2' : 'var(--bg-card)',
                border: isActive ? '1px solid #c41e1e' : '1px solid var(--border)',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#c41e1e' : '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {!episode.is_free ? (
                  <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                ) : isCurrentlyPlaying ? (
                  <Pause size={14} style={{ color: isActive ? '#fff' : 'var(--text-body)' }} />
                ) : (
                  <Play
                    size={14}
                    style={{
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      marginLeft: '2px',
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isActive ? '#c41e1e' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {index + 1}. {episode.title}
                </p>
                {episode.description && (
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {episode.description}
                  </p>
                )}
              </div>

              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                {formatDuration(episode.duration_seconds)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
