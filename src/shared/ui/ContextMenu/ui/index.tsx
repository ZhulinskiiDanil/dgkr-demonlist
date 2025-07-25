'use client';

import clsx from 'clsx';
import styles from './ContextMenu.module.scss';

import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { ReactNode, useState } from 'react';

type ContextMenuProps = {
  button: ReactNode;
  children: ReactNode;
} & React.JSX.IntrinsicElements['div'];

export function ContextMenu({
  button,
  className,
  children,
  ...props
}: ContextMenuProps) {
  const [alignRight] = useState(true);

  return (
    <div className={clsx(styles.wrapper, className)} {...props}>
      <Menu as="div" className={styles.menu}>
        <MenuButton className={styles.button}>{button}</MenuButton>

        <MenuItems
          className={`${styles.items} ${alignRight ? styles.right : styles.left}`}
        >
          {children}
        </MenuItems>
      </Menu>
    </div>
  );
}
