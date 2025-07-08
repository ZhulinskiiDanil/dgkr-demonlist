import styles from './page.module.scss';

import { DGKRList } from '@/widgets/DGKRList/ui';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <DGKRList />
        </div>
      </main>
    </div>
  );
}
