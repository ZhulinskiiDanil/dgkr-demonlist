import cn from 'clsx';
import styles from './UIInput.module.scss';

type UIInputProps = React.JSX.IntrinsicElements['input'] & {
  fill?: boolean;
};

export const UIInput: React.FC<UIInputProps> = ({
  fill,
  className,
  ...props
}) => {
  return (
    <input
      type="text"
      className={cn(styles.input, fill && styles.fill, className)}
      {...props}
    />
  );
};
