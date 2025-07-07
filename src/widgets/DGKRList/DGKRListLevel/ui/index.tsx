import clsx from 'clsx';
import styles from './DGKRListLevel.module.css';

import type { DemonlistLevel, DGKRListLevel } from '@/shared/types/demonlist';

import { useSession } from 'next-auth/react';
import { getLevelThumbnailById } from '@/shared/utils/getLevelThumbnailById';

import Link from 'next/link';
import Image from 'next/image';

export function DGKRListLevel({
  data,
  demonlistLevel,
  place,
}: {
  data: DGKRListLevel;
  demonlistLevel: DemonlistLevel;
  place: number;
}) {
  const session = useSession();
  const thumbnailUrl = getLevelThumbnailById(demonlistLevel.level_id);
  const username = session.data?.user?.name;
  const isCompleted = data.victors.some(
    (victor) => victor.discordTag === username
  );

  return (
    <li className={clsx(styles.level, isCompleted && styles.completed)}>
      <div className={styles.row}>
        <div className={styles.thumbnailWrapper}>
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={`Thumbnail of ${demonlistLevel.name}`}
              className={styles.thumbnail}
              fill
            />
          ) : (
            <div className={styles.thumbnailPlaceholder}>No Thumbnail</div>
          )}
        </div>

        <div className={styles.victors}>
          <h3>Victors – {data.victors.length}</h3>
          <ul>
            {(data.victors as ((typeof data.victors)['0'] | null)[])
              .concat(...[null, null])
              .slice(0, 3)
              .map((victor, idx) => (
                <li key={idx} style={{ '--index': idx } as React.CSSProperties}>
                  {!victor && (
                    <Link href="#" rel="noopener noreferrer">
                      <span className={styles.place}>{idx + 1}</span>
                      <span className={styles.username}>N/A</span>
                    </Link>
                  )}
                  {victor && (
                    <Link
                      href={victor.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.place}>{idx + 1}</span>
                      <span className={styles.username}>
                        {victor.demonlistNick}
                      </span>{' '}
                      <span className={styles.percent}>
                        ({victor.percent}%)
                      </span>
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>{demonlistLevel.name}</h2>
            <div className={styles.places}>
              <span className={styles.importantPlace}>★ #{place}</span>
              <span className={styles.place}>#{demonlistLevel.place}</span>
            </div>
          </div>

          <p className={styles.creator}>
            <strong>Creator:</strong> {demonlistLevel.creator}
          </p>

          <p className={styles.verifier}>
            <strong>Verifier:</strong> {demonlistLevel.verifier}
          </p>

          <div className={styles.links}>
            <a
              href={demonlistLevel.video}
              target="_blank"
              rel="noopener noreferrer"
            >
              🎥 Watch Video
            </a>
            <a
              href={demonlistLevel.song}
              target="_blank"
              rel="noopener noreferrer"
            >
              🎵 Song
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
