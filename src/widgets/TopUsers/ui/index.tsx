import styles from './TopUsers.module.scss';

import { useUsers } from '@/shared/hooks/useUsers';

import { TopUser } from '../User/ui';

export function TopUsers() {
  const users = useUsers();

  return (
    <ul className={styles.list}>
      {users.map((user, index) => (
        <TopUser key={user.victor.victorName} user={user} place={index + 1} />
      ))}
    </ul>
  );
}
