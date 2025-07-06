import styles from './DGKRList.module.css';

import { GDKRListLevel } from '../GDKRListLevel/ui';
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
        ?.map((level) => {
          const demonlistLevel = getDemonlistLevelById(level.levelId);

          if (!demonlistLevel) return;

          return (
            <GDKRListLevel
              key={level.levelId}
              data={level}
              demonlistLevel={demonlistLevel}
            />
          );
        })
        .filter(Boolean)}
    </ul>
  );
}
