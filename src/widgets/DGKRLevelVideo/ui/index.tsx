'use client';

import { getYoutubeVideoId } from '@/shared/utils/getYoutubeVideoId';
import styles from './DGKRLevelVideo.module.scss';

import type { DGKRVictor } from '@/shared/types/demonlist';

export function DGKRLevelVideo({ victor }: { victor: DGKRVictor }) {
  const videoUrl = victor?.videoUrl || '';
  const videoId = getYoutubeVideoId(videoUrl);
  const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <main className={styles.container}>
      {videoUrl && (
        <div className={styles.videoWrapper}>
          <iframe
            src={embed}
            style={{ border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.video}
          />
        </div>
      )}
    </main>
  );
}
