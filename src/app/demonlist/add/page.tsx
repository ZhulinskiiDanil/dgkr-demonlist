import styles from './page.module.scss';

import LevelSendForm from '@/widgets/LevelSendForm/ui';

export default function LevelPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <main className={styles.main}>
          <LevelSendForm />
        </main>
      </div>
    </div>
  );
}
