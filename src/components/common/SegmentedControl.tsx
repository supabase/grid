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
  const borderOverride = 'grid-border-gray-600';
  const buttonStyle = `grid-absolute grid-top-0 grid-z-1 grid-text-xs grid-inline-flex grid-h-full grid-items-center grid-justify-center grid-font-medium
    hover:grid-text-white focus:grid-z-10 focus:grid-outline-none active:grid-bg-gray-100 grid-transition grid-ease-in-out grid-duration-150`;

  return (
    <div
      className={`grid-relative grid-mx-2 grid-border ${borderOverride} grid-rounded-md h-8`}
      style={{ padding: 1, width: 102 }}
    >
      <span
        style={{ width: 50 }}
        aria-hidden="true"
        className={`${
          value === options[1] ? 'grid-translate-x-0' : 'grid-translate-x-12'
        } grid-z-0 grid-inline-block grid-rounded grid-h-full grid-bg-gray-600 grid-shadow grid-transform grid-transition grid-ease-in-out grid-duration-200 grid-border grid-border-gray-600`}
      ></span>
      {options.map((option, index) => (
        <span
          key={`toggle_${index}`}
          style={{ width: 51 }}
          className={`
              ${value === option ? 'grid-text-gray-200' : 'grid-text-gray-400'} 
              ${index === 0 ? 'grid-right-0' : 'grid-left-0'} 
              ${buttonStyle}
              grid-cursor-pointer
            `}
          onClick={() => onToggle(option)}
        >
          <span className="grid-text-color-inherit grid-uppercase">
            {option}
          </span>
        </span>
      ))}
    </div>
  );
};
