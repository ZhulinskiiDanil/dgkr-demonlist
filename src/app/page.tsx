'use client';
import styles from './page.module.scss';

// import { useId, useMemo, useState } from 'react';
// import { parseLevelStats } from '@/shared/utils/parseLevelStats';
// import { findLevelByName } from '@/shared/utils/demonlist/findLevelByName';
// import { getLevelThumbnailById } from '@/shared/utils/getLevelThumbnailById';

// import { useDemonlistQuery } from '@/shared/hooks/useDemonlistQuery';

import { Header } from '@/widgets/Header/ui';
import { DGKRList } from '@/widgets/DGKRList/ui';
// import { Grid } from '@/shared/ui/Grid/ui';
// import { GridItem } from '@/shared/ui/GridItem/ui';
// import { UIButton } from '@/shared/ui/Button/ui';
// import { LevelCollectedData } from '@/widgets/LevelCollectedData/ui';

export default function Home() {
  // const { data: demonlist } = useDemonlistQuery();
  // const [texts, setTexts] = useState<string[]>([]);
  // const stats = useMemo(() => {
  //   return parseLevelStats(texts);
  // }, [texts]);
  // const levelData = useMemo(() => {
  //   const levels = stats.data.map((level) => {
  //     if (level?.levelName) {
  //       return findLevelByName(demonlist, level.levelName);
  //     }
  //   });
  //   const level = levels.find((level) => level);

  //   return level || null;
  // }, [demonlist, stats]);
  // const imageUrl =
  //   levelData?.level_id && getLevelThumbnailById(levelData.level_id);

  return (
    <div className={styles.page}>
      {/* {imageUrl && (
        <img alt="Level" src={imageUrl} className={styles.thumbnail} />
      )} */}
      <Header />
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <DGKRList />
        </div>
      </main>
    </div>
  );
}
