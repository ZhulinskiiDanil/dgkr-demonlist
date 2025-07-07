import styles from './Grid.module.scss';

export const Grid = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.grid}>{children}</div>;
};
