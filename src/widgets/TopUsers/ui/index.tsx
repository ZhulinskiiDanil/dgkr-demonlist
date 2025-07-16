'use client';
import styles from './TopUsers.module.scss';

import { useUsers } from '@/shared/hooks/useUsers';

import { TopUser } from '../User/ui';
import clsx from 'clsx';

export function TopUsers({
  max = Infinity,
  className,
  ...props
}: React.JSX.IntrinsicElements['ul'] & {
  max?: number;
}) {
  const users = useUsers();

  return (
    <ul className={clsx(styles.list, className)} {...props}>
      {users.slice(0, max).map((user, index) => (
        <TopUser key={user.victor.victorName} user={user} place={index + 1} />
      ))}
    </ul>
  );
}
