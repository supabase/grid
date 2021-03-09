import * as React from 'react';
import { Dropdown, Menu, Typography } from '@supabase/ui';

type DropdownControlProps = {
  options: { value: string | number; label: string }[];
  onSelect: (value: string | number) => void;
  className?: string;
};

export const DropdownControl: React.FC<DropdownControlProps> = p => {
  const { className, children } = p;
  return (
    <Dropdown
      className={className}
      placement="bottomLeft"
      overlay={<DropdownItem {...p} />}
    >
      {children}
    </Dropdown>
  );
};

const DropdownItem: React.FC<DropdownControlProps> = ({
  options,
  onSelect,
}) => {
  return (
    <Menu>
      {options.length == 0 && (
        <Typography.Text className="block px-2 py-4">
          No more items
        </Typography.Text>
      )}
      {options.map(x => {
        return (
          <Menu.Item key={x.value} onClick={() => onSelect(x.value)}>
            {x.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
