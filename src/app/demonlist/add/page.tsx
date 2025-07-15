import styles from './page.module.scss';

import { Suspense } from 'react';
import AddLevelForm from '@/widgets/AddLevelForm/ui';

export default function AddLevelPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <main className={styles.main}>
          <Suspense>
            <AddLevelForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
