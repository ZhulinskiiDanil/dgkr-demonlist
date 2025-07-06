import styles from './Header.module.css';

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.cw}>
        <Link href="https://discord.gg/z9pmtkHX9b" target="_blank">
          <Image
            src="/logo.png"
            alt="Logo"
            title="Join our Discord"
            width={48}
            height={48}
            className={styles.logo}
          />
        </Link>
        <h1 className={styles.title}>
          <div className={styles.image}>
            <Image
              alt="DGKR"
              src="/logo - DGKR.png"
              objectFit="cover"
              className={styles.dgkr}
              fill
            />
          </div>
          Demonlist
        </h1>
      </div>
    </header>
  );
}
