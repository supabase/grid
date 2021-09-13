import * as React from 'react';
import { Dropdown, Typography } from '@supabase/ui';

type DropdownControlProps = {
  options: { value: string | number; label: string }[];
  onSelect: (value: string | number) => void;
  className?: string;
  side?: 'bottom' | 'left' | 'top' | 'right' | undefined;
  align?: 'start' | 'center' | 'end' | undefined;
  isNested?: boolean;
};

export const DropdownControl: React.FC<DropdownControlProps> = (p) => {
  const { className, children, side, align, isNested } = p;
  return (
    <Dropdown
      className={className}
      side={side}
      align={align}
      overlay={<DropdownItems {...p} />}
      isNested={isNested}
    >
      {children}
    </Dropdown>
  );
};

const DropdownItems: React.FC<DropdownControlProps> = ({
  options,
  onSelect,
}) => {
  return (
    <div className="dropdown-control" style={{ maxHeight: '30vh' }}>
      {options.length == 0 && (
        <Typography.Text className="dropdown-control__empty-text">
          No more items
        </Typography.Text>
      )}
      {options.map((x) => {
        return (
          <Dropdown.Item key={x.value} onClick={() => onSelect(x.value)}>
            {x.label}
          </Dropdown.Item>
        );
      })}
    </div>
  );
};
