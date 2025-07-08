'use client';

import styles from './DGKRLevelVideo.module.scss';

import type { DGKRVictor } from '@/shared/types/demonlist';

export function DGKRLevelVideo({ victor }: { victor: DGKRVictor }) {
  const videoUrl = victor?.videoUrl || '';

  return (
    <main className={styles.container}>
      {videoUrl && (
        <div className={styles.videoWrapper}>
          <iframe
            src={videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1'}
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
