import styles from './TopUsers.module.scss';

import type { TopUser } from '@/shared/types/users';

import Image from 'next/image';

export function TopUser({ user, place }: { user: TopUser; place: number }) {
  const rankAll = 'rankIcon_all.png';
  const rankTop10 = 'rankIcon_top10.png';
  const rankTop50 = 'rankIcon_top50.png';
  const rankTop100 = 'rankIcon_top100.png';
  const rankIcon =
    place <= 1
      ? rankTop10
      : place <= 2
        ? rankTop50
        : place <= 3
          ? rankTop100
          : rankAll;
  const flag = user.victor.flag
    ? `https://purecatamphetamine.github.io/country-flag-icons/3x2/${user.victor.flag}.svg`
    : '/icons/unknown_flag.png';

  return (
    <li className={styles.user}>
      <Image
        src={`/icons/${rankIcon}`}
        alt="rank"
        width={32}
        height={32}
        className={styles.rank}
      />
      <div className={styles.place}>{place}</div>
      <div className={styles.flag}>
        <Image className={styles.flag__image} src={flag} alt={flag} fill />
      </div>
      <span className={styles.username}>{user.victor.victorName}</span>
      <span className={styles.discord}>@{user.victor.discordTag}</span>
      <b className={styles.score}>{user.meta.totalScore.toFixed(2)}</b>
    </li>
  );
}
