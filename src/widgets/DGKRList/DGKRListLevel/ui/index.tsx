import styles from './DGKRListLevel.module.css';

import { getLevelThumbnailById } from '@/shared/utils/getLevelThumbnailById';
import type { DemonlistLevel, DGKRListLevel } from '@/shared/types/demonlist';

export function DGKRListLevel({
  data,
  demonlistLevel,
  place,
}: {
  data: DGKRListLevel;
  demonlistLevel: DemonlistLevel;
  place: number;
}) {
  const thumbnailUrl = getLevelThumbnailById(demonlistLevel.level_id);

  return (
    <li className={styles.level}>
      <div className={styles.row}>
        <div className={styles.thumbnailWrapper}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`Thumbnail of ${demonlistLevel.name}`}
              className={styles.thumbnail}
            />
          ) : (
            <div className={styles.thumbnailPlaceholder}>No Thumbnail</div>
          )}
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

          <div className={styles.victors}>
            <h3>Victors</h3>
            <ul>
              {data.victors.map((victor, idx) => (
                <li key={idx}>
                  <a
                    href={victor.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {victor.demonlistNick} ({victor.percent}%)
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}
