import styles from './page.module.scss';

import { TopUsers } from '@/widgets/TopUsers/ui';
import { DGKRList } from '@/widgets/DGKRList/ui';
import { UIButton } from '@/shared/ui/Button/ui';

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <Sidebar />
          <DGKRList className={styles.list} />
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.stickyWrapper}>
        <p className={styles.title}>Топ 30 игроков</p>
        <TopUsers max={30} />
        <UIButton href="/users" className={styles.button} fill big>
          Смотреть всех
        </UIButton>
      </div>
    </div>
  );
}
