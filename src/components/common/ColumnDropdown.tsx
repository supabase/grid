import * as React from 'react';
import { Dropdown, Menu, Button } from '@supabase/ui';
import { useTrackedState } from '../../store';

type ColumnDropdownProps = {};

export const ColumnDropdown: React.FC<ColumnDropdownProps> = p => {
  return (
    <Dropdown
      className="w-40"
      placement="bottomLeft"
      overlay={<Columns {...p} />}
    >
      <Button type="primary">Pick another column to sort by</Button>
    </Dropdown>
  );
};

const Columns: React.FC<ColumnDropdownProps> = ({}) => {
  const state = useTrackedState();
  // TODO: filter base on existed sorting columns
  const columns = state?.table?.columns!;

  function onClick(columnId: string | number) {
    console.log('select columnId', columnId);
  }

  return (
    <Menu>
      {columns.map(x => {
        return (
          <Menu.Item onClick={() => onClick(x.id)} key={x.id}>
            {x.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
