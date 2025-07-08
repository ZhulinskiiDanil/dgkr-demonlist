import styles from './page.module.scss';

import { notFound } from 'next/navigation';
import { getDemonList } from '@/shared/api/getDemonList';

import { DGKRLevelVideo } from '@/widgets/DGKRLevelVideo/ui';
import { getDGKRList } from '@/shared/api/getDGKRList';
import { VideoLevelVictorCard } from '@/widgets/VideoLevelVictorCard/ui';

export default async function LevelPage({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { levelId, victorName } = await params;
  const demonlist = await getDemonList();
  const dgkrList = await getDGKRList();
  const demonlistLevel = (Array.isArray(demonlist) ? demonlist : []).find(
    (item) => item.level_id.toString() === levelId
  );
  const dgkrLevel = dgkrList.find(
    (item) => item.levelId.toString() === levelId
  );
  const victorIndex = dgkrLevel?.victors.findIndex(
    (victor) => victor.demonlistNick === victorName
  );
  const selectedVictor =
    victorIndex !== undefined &&
    victorIndex >= 0 &&
    dgkrLevel?.victors[victorIndex];

  if (!dgkrLevel || !demonlistLevel || !selectedVictor) {
    return notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <main className={styles.main}>
          {/* Видео */}
          <DGKRLevelVideo victor={selectedVictor} />

          {/* Блок под видео */}
          <div className={styles.videoDetails}>
            <h1 className={styles.videoTitle}>{demonlistLevel.name}</h1>

            <div className={styles.videoMeta}>
              <span className={styles.author}>By {demonlistLevel.creator}</span>
            </div>

            <div className={styles.videoDescription}>
              {demonlistLevel.description}
            </div>
          </div>
        </main>

        {/* Блок рекомендаций */}
        <aside className={styles.sidebar}>
          <div className={styles.victors}>
            <p>Сейчас играет:</p>
            <VideoLevelVictorCard
              key={selectedVictor.demonlistNick}
              href={`/demonlist/${levelId}/${selectedVictor.demonlistNick}`}
              variant="secondary"
              victor={selectedVictor}
              num={victorIndex + 1}
            />
            <hr className={styles.hr} />
            <p>Victors - {dgkrLevel.victors.length}</p>
            {dgkrLevel.victors.map((victor, index) => {
              return (
                <VideoLevelVictorCard
                  key={victor.demonlistNick}
                  href={`/demonlist/${levelId}/${victor.demonlistNick}`}
                  victor={victor}
                  num={index + 1}
                />
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
