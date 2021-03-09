import * as React from 'react';
import { Dropdown, Menu, Button, Typography } from '@supabase/ui';
import { SupaColumn } from '../../types';

type ColumnDropdownProps = {
  btnText: string;
  columns: SupaColumn[];
  onClick: (columnId: string | number) => void;
};

export const ColumnDropdown: React.FC<ColumnDropdownProps> = p => {
  const { btnText } = p;
  return (
    <Dropdown
      className="w-40"
      placement="bottomLeft"
      overlay={<Columns {...p} />}
    >
      <Button type="primary">{btnText}</Button>
    </Dropdown>
  );
};

const Columns: React.FC<ColumnDropdownProps> = ({ columns, onClick }) => {
  return (
    <Menu>
      {columns.length == 0 && (
        <Typography.Text className="px-2 py-4">No more items</Typography.Text>
      )}
      {columns.map(x => {
        return (
          <Menu.Item key={x.id} onClick={() => onClick(x.id)}>
            {x.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
