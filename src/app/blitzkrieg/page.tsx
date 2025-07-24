'use client';
import styles from './page.module.scss';

import { BlitzKrieg } from '@/widgets/BlitzKrieg/ui';

export default function BlitzKriegPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <main className={styles.main}>
          <h1 className={styles.title}>Blitzkrieg Tracker</h1>
          <BlitzKrieg />
        </main>
      </div>
    </div>
  );
}
