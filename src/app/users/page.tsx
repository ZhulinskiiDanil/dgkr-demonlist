'use client';
import styles from './page.module.scss';

import Image from 'next/image';
import { TopUsers } from '@/widgets/TopUsers/ui';

export default function UsersPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <Image
              className={styles.rank}
              src="/icons/rankIcon_top10.png"
              alt="Rank"
              width={49}
              height={40}
            />
            Топ игроков сервера
          </h1>
          <TopUsers />
        </main>
      </div>
    </div>
  );
}
