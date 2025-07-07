import styles from './DGKRList.module.scss';

import { DGKRListLevel } from '../DGKRListLevel/ui';
import { useDGKRListQuery } from '@/shared/hooks/useDGKRListQuery';
import { useDemonlistQuery } from '@/shared/hooks/useDemonlistQuery';

export function DGKRList() {
  const { data: levelsList } = useDGKRListQuery();
  const { data: demonlist } = useDemonlistQuery();

  function getDemonlistLevelById(id: string | number) {
    return demonlist.find((level) => level.level_id === id) || null;
  }

  // Sort levels by place
  const sortedLevels = levelsList?.sort((a, b) => {
    const aLevel = getDemonlistLevelById(a.levelId);
    const bLevel = getDemonlistLevelById(b.levelId);

    if (!aLevel || !bLevel) return 0;
    const placeA = aLevel.place || 0;
    const placeB = bLevel.place || 0;
    return placeA - placeB;
  });

  return (
    <ul className={styles.list}>
      {(sortedLevels || [])
        .map((level, index) => {
          const demonlistLevel = getDemonlistLevelById(level.levelId);

          if (!demonlistLevel) return;

          return (
            <DGKRListLevel
              key={level.levelId}
              data={level}
              demonlistLevel={demonlistLevel}
              place={index + 1}
            />
          );
        })
        .filter(Boolean)}
    </ul>
  );
}
