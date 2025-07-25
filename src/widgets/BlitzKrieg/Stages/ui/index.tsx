import _ from 'lodash';
import clsx from 'clsx';
import styles from './Stages.module.scss';

import type { Stage } from '@/shared/types/blitzkrieg';

import { useState } from 'react';

import { PencilIcon } from '@/shared/icons/Pencil';
import { UICheckbox } from '@/shared/ui/Checkbox/ui';

type StagesProps = {
  stages: Stage[];
  onChange?: (stages: Stage[]) => void;
};

export const Stages: React.FC<StagesProps> = ({
  stages: _stages,
  onChange,
}) => {
  const [stages, setStages] = useState(_stages);

  if (stages.length === 0) return null;

  function handleRangeChange(
    stage: Stage,
    checked: boolean,
    range?: Stage['ranges']['0']
  ) {
    const newStages: Stage[] = stages.map((oldStage) => {
      const newRanges = oldStage.ranges.map((elm) => {
        if (elm === range && range) {
          return {
            ...elm,
            checked,
          };
        } else if (!range && oldStage === stage) {
          return {
            ...elm,
            checked: !oldStage.ranges.every((range) => range.checked),
          };
        }

        return elm;
      });

      return {
        ...oldStage,
        ranges: _.cloneDeep(newRanges),
      };
    });

    setStages(newStages);
    onChange?.(_.cloneDeep(newStages));
  }

  function handleStageNoteChange(stage: Stage, note: string) {
    const newStages: Stage[] = stages.map((oldStage) => ({
      ...oldStage,
      note: oldStage === stage ? note : oldStage.note,
    }));

    setStages(newStages);
    onChange?.(_.cloneDeep(newStages));
  }

  return (
    <div className={styles.stages}>
      <h3 className={styles.title}>Стадии:</h3>
      <div className={styles.stagesList}>
        {stages.map((stage, index) => (
          <div key={index} className={styles.stage}>
            <div className={styles.header}>
              <label className={styles.checkbox}>
                <UICheckbox
                  checked={stage.ranges.every((range) => range.checked)}
                  onChange={(e) => handleRangeChange(stage, e.target.checked)}
                />
                Stage {stage.stage}
              </label>
              <label className={styles.note}>
                <PencilIcon className={styles.icon} />{' '}
                <input
                  type="text"
                  placeholder="Напишите заметку"
                  maxLength={16}
                  value={stage.note}
                  className={styles.input}
                  onChange={(e) => handleStageNoteChange(stage, e.target.value)}
                />
              </label>
            </div>
            <ul className={styles.rangesList}>
              {stage.ranges.map((range, idx) => (
                <li key={idx} className={clsx(range.checked && styles.checked)}>
                  <UICheckbox
                    onChange={(e) =>
                      handleRangeChange(stage, e.target.checked, range)
                    }
                    checked={range.checked}
                  />{' '}
                  {range.from} - {range.to}
                  <div
                    className={styles.line}
                    style={
                      {
                        '--from': (range.from / 100).toString(),
                        '--to': (range.to / 100).toString(),
                      } as React.CSSProperties
                    }
                  ></div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
