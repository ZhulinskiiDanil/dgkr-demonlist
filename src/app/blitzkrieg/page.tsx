'use client';
import Image from 'next/image';
import styles from './page.module.scss';

import { BlitzKrieg } from '@/widgets/BlitzKrieg/ui';

export default function BlitzKriegPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <main className={styles.main}>
          <Image
            src="/icons/diffIcon_10_btn.png"
            alt="diffIcon_10_btn.png"
            width={128}
            height={128}
            className={styles.extremeImage}
          />
          <h1 className={styles.title}>Blitzkrieg Tracker</h1>
          <BlitzKrieg />
        </main>
      </div>
    </div>
  );
}
