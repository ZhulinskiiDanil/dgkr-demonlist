import _ from 'lodash';
import styles from './Stages.module.scss';

import type { Stage } from '@/shared/types/blitzkrieg';

import { UICheckbox } from '@/shared/ui/Checkbox/ui';
import clsx from 'clsx';

type StagesProps = {
  stages: Stage[];
  onChange?: (stages: Stage[]) => void;
};

export const Stages: React.FC<StagesProps> = ({ stages, onChange }) => {
  if (stages.length === 0) return null;

  function handleChange(
    checked: boolean,
    stage: Stage,
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

    onChange?.(_.cloneDeep(newStages));
  }

  return (
    <div className={styles.stages}>
      <h3 className={styles.title}>Стадии:</h3>
      <div className={styles.stagesList}>
        {stages.map((stage, index) => (
          <div key={index} className={styles.stage}>
            <div className={styles.stageHead}>
              <UICheckbox
                checked={stage.ranges.every((range) => range.checked)}
                onChange={(e) => handleChange(e.target.checked, stage)}
              />
              Stage {stage.stage}
            </div>
            <ul className={styles.rangesList}>
              {stage.ranges.map((range, idx) => (
                <li key={idx} className={clsx(range.checked && styles.checked)}>
                  <UICheckbox
                    onChange={(e) =>
                      handleChange(e.target.checked, stage, range)
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
