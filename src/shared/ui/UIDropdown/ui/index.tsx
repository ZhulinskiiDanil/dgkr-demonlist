'use client';

import cn from 'clsx';
import styles from './UIDropdown.module.scss';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@/shared/icons/ChevronDown';
import clsx from 'clsx';

type Option<T> = {
  label: string;
  value: T;
};

type UIDropdownProps<T> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  fill?: boolean;
  disabled?: boolean;
  className?: string;
};

export function UIDropdown<T>({
  value,
  options,
  onChange,
  placeholder = 'Выберите...',
  fill = false,
  disabled = false,
  className,
}: UIDropdownProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Listbox
      value={value}
      onChange={onChange}
      disabled={disabled}
      as="div"
      className={cn(styles.dropdown, fill && styles.fill, className)}
    >
      {({ open }) => (
        <>
          <ListboxButton className={styles.button}>
            <span>{selectedOption?.label || placeholder}</span>

            <ChevronDownIcon
              className={clsx(styles.chevron, open && styles.flipped)}
            />
          </ListboxButton>

          <ListboxOptions className={styles.options}>
            {options.map((opt, index) => (
              <ListboxOption key={index} value={opt.value} as={Fragment}>
                {({ selected }) => (
                  <li
                    className={cn(styles.option, {
                      [styles.active]: value === opt.value,
                      [styles.selected]: selected,
                    })}
                  >
                    {opt.label}
                  </li>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  );
}
