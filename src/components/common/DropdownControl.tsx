import * as React from 'react';
import { Dropdown, Menu, Button, Typography } from '@supabase/ui';

type DropdownControlProps = {
  btnText: string;
  options: { value: string | number; label: string }[];
  onSelect: (value: string | number) => void;
};

export const DropdownControl: React.FC<DropdownControlProps> = p => {
  const { btnText } = p;
  return (
    <Dropdown
      className="w-40"
      placement="bottomLeft"
      overlay={<DropdownItem {...p} />}
    >
      <Button type="primary">{btnText}</Button>
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
