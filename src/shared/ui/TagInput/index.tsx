import styles from './TagInput.module.scss';

// Icons
import { XMarkMiniIcon } from '@/shared/icons/XMarkMini';

// React
import { useState } from 'react';

// Components
import { UIInput } from '@/shared/ui/Input/ui';

type TagInputProps = {
  value: (string | number)[];
  onChange: (tags: (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  numericOnly?: boolean;
  sort?: 'asc' | 'desc' | false;
  min?: number;
  max?: number;
};

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = 'Введите тег и нажмите Enter',
  disabled = false,
  numericOnly = false,
  sort = false,
  min,
  max,
}) => {
  const [input, setInput] = useState('');

  const isValid = (tag: string) => {
    const trimmed = tag.trim();

    if (!trimmed) return false;

    if (numericOnly) {
      if (!/^\d+$/.test(trimmed)) return false;

      const number = parseInt(trimmed, 10);
      if (min !== undefined && number < min) return false;
      if (max !== undefined && number > max) return false;
    }

    return true;
  };

  const sortTags = (tags: (string | number)[]) => {
    if (sort === 'asc') return [...tags].sort((a, b) => +a - +b);
    if (sort === 'desc') return [...tags].sort((a, b) => +b - +a);
    return tags;
  };

  const addTags = (tagsToAdd: string[]) => {
    const cleaned = tagsToAdd
      .map((t) => t.trim())
      .filter((t) => isValid(t) && !value.includes(t));

    if (cleaned.length === 0) return;

    const updated = sortTags([...value, ...cleaned]);
    onChange(updated);
  };

  const addTag = (tag: string) => {
    addTags([tag]);
  };

  const removeTag = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!numericOnly || /^\d*$/.test(val)) {
      setInput(val);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    // Разбиваем по запятым, пробелам, переводам строки
    const parts = paste.split(/[\s,]+/).filter(Boolean);
    addTags(parts);
    setInput('');
  };

  return (
    <div className={styles.container}>
      {!disabled && (
        <UIInput
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
        />
      )}
      {value.length > 0 && (
        <div className={styles.tags}>
          {value.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              {!disabled && (
                <XMarkMiniIcon
                  onClick={() => removeTag(index)}
                  className={styles.removeButton}
                />
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
