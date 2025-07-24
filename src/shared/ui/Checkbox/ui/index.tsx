import React, { useId } from 'react';
import styles from './Checkbox.module.scss';

type CheckboxProps = {
  id?: string;
  label?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const UICheckbox: React.FC<CheckboxProps> = ({
  id,
  label,
  className,
  checked,
  onChange,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <label
      className={`${styles.checkboxContainer} ${className || ''}`}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
