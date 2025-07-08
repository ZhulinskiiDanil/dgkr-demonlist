import clsx from 'clsx';
import styles from './VideoLevelVictorCard.module.scss';

import type { DGKRVictor } from '@/shared/types/demonlist';

import Link from 'next/link';
import Image from 'next/image';
import { UIButton } from '@/shared/ui/Button/ui';

type VideoLevelVictorCardProps = {
  num: number;
  href: string;
  victor: DGKRVictor;
  variant?: 'primary' | 'secondary';
} & React.JSX.IntrinsicElements['div'];

export const VideoLevelVictorCard: React.FC<VideoLevelVictorCardProps> = ({
  num,
  victor,
  href,
  variant = 'primary',
  className,
  ...props
}) => {
  const videoId = new URL(victor.videoUrl).searchParams.get('v');
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={clsx(styles.card, styles[variant], className)}
      data-num={num}
      {...props}
    >
      {victor.flag && (
        <Image
          src={`/country-flags/svg/${victor.flag}.svg`}
          alt={victor.flag}
          width={64}
          height={32}
          className={styles.flag}
        />
      )}

      <Link href={href} className={styles.thumbnailWrapper}>
        <Image
          src={thumbnailUrl}
          alt={`${victor.victorName}'s video`}
          width={480}
          height={360}
          className={styles.thumbnail}
        />
      </Link>
      <div className={styles.info}>
        <Link href={href}>
          <div className={styles.nick}>
            #{num} {victor.victorName}
          </div>
        </Link>
        <div className={styles.meta}>
          <span>{victor.percent}%</span>
          <span className={styles.date}>
            {new Date(victor.addedAt).toLocaleDateString()}
          </span>
        </div>
        <UIButton
          fill
          external
          href={victor.videoUrl}
          className={styles.button}
        >
          Смотреть на YouTube
        </UIButton>
      </div>
    </div>
  );
};
