import styles from './DGKRList.module.css';

import { DGKRListLevel } from '../DGKRListLevel/ui';
import { useDGKRListQuery } from '@/shared/hooks/useDGKRListQuery';
import { useDemonlistQuery } from '@/shared/hooks/useDemonlistQuery';

export function DGKRList() {
  const { data: levelsList } = useDGKRListQuery();
  const { data: demonlist } = useDemonlistQuery();

  console.log(levelsList);

  function getDemonlistLevelById(id: string | number) {
    return demonlist.find((level) => level.level_id === id) || null;
  }

  return (
    <ul className={styles.list}>
      {levelsList
        ?.map((level, index) => {
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
