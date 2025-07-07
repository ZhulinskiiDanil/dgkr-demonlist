import clsx from 'clsx';
import styles from './NavButton.module.scss';

import type { JSX } from 'react';
import Link from 'next/link';

export function UINavButton({
  fill = false,
  big = false,
  className,
  children,
  href,
  external = false,
  variant = 'primary',
  ...props
}: JSX.IntrinsicElements['button'] & {
  big?: boolean;
  fill?: boolean;
  href?: string;
  external?: boolean;
  variant?: 'primary' | 'discord';
}) {
  const classList = clsx(
    styles.button,
    styles[variant],
    fill && styles.fill,
    big && styles.big,
    className
  );

  const button = (
    <button className={classList} {...props}>
      {children}
    </button>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={clsx(styles.link, classList)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {button}
        </a>
      );
    }
    return (
      <Link className={clsx(styles.link, classList)} href={href}>
        {button}
      </Link>
    );
  }

  return button;
}
