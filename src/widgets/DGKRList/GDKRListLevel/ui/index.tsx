import styles from './GDKRListLevel.module.css';

import type { DemonlistLevel, DGKRListLevel } from '@/shared/types/demonlist';

export function GDKRListLevel({
  data,
  demonlistLevel,
}: {
  data: DGKRListLevel;
  demonlistLevel: DemonlistLevel;
}) {
  return (
    <li className={styles.level}>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(demonlistLevel, undefined, 2)}
        {JSON.stringify(data.victors, undefined, 2)}
      </pre>
    </li>
  );
}
