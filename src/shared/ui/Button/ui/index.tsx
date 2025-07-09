import clsx from 'clsx';
import styles from './Button.module.scss';

import type { JSX } from 'react';
import Link from 'next/link';

export function UIButton({
  href,
  target = '_self',
  big = false,
  fill = false,
  external = false,
  className,
  children,
  ...props
}: JSX.IntrinsicElements['button'] & {
  big?: boolean;
  fill?: boolean;
  href?: string;
  external?: boolean;
  target?: JSX.IntrinsicElements['a']['target'];
}) {
  const classList = clsx(
    styles.button,
    styles.primary,
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
          target={target}
          rel="noopener noreferrer"
        >
          {button}
        </a>
      );
    }
    return (
      <Link
        className={clsx(styles.link, classList)}
        href={href}
        target={target}
      >
        {button}
      </Link>
    );
  }

  return button;
}
