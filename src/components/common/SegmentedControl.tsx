import * as React from 'react';

type SegmentedControlProps = {
  options: [string, string];
  value: string;
  onToggle: (value: string) => void;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onToggle,
}) => {
  let labelStyles = ['rdg__segmented-control__label'];
  if (value === options[1]) {
    labelStyles.push('rdg__segmented-control__label--left');
  } else {
    labelStyles.push('rdg__segmented-control__label--right');
  }
  return (
    <div
      className={`rdg__segmented-control`}
      style={{ padding: 1, width: 102 }}
    >
      <span
        style={{ width: 50 }}
        aria-hidden="true"
        className={labelStyles.join(' ')}
      ></span>
      {options.map((option, index) => {
        let buttonStyles = ['rdg__segmented-control__button'];
        if (value === option) {
          buttonStyles.push('rdg__segmented-control__button--option');
        }
        if (index === 0) {
          buttonStyles.push('rdg__segmented-control__button--right');
        } else {
          buttonStyles.push('rdg__segmented-control__button--left');
        }
        return (
          <span
            key={`toggle_${index}`}
            style={{ width: 51 }}
            className={buttonStyles.join(' ')}
            onClick={() => onToggle(option)}
          >
            <span className="rdg__segmented-control__options-label">
              {option}
            </span>
          </span>
        );
      })}
    </div>
  );
};
