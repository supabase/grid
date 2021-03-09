import * as React from 'react';
import { Dropdown, Button, Typography } from '@supabase/ui';
import { ColumnDropdown } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';
import SortRow from './SortRow';

type SortDropdownProps = {};

const SortDropdown: React.FC<SortDropdownProps> = p => {
  return (
    <Dropdown
      className="w-80 overflow-visible"
      placement="bottomLeft"
      overlay={<Sort {...p} />}
    >
      <Button type="secondary">Sort 1</Button>
    </Dropdown>
  );
};
export default SortDropdown;

const Sort: React.FC<SortDropdownProps> = ({}) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const columns = state?.table?.columns!.filter(x => {
    const found = state.sorts.find(y => y.columnId == x.id);
    return !found;
  });

  function onAddSort(columnId: string | number) {
    dispatch({
      type: 'ADD_SORT',
      payload: { columnId, order: 'ASC' },
    });
  }

  return (
    <div className="p-2">
      <div>
        {state.sorts.length == 0 && (
          <Typography.Text>No sorts applied</Typography.Text>
        )}
        {state.sorts.map(x => {
          return <SortRow key={x.columnId} columnId={x.columnId} />;
        })}
      </div>
      <div className="mt-2">
        <ColumnDropdown
          btnText="Pick another column to sort by"
          columns={columns || []}
          onClick={onAddSort}
        />
      </div>
    </div>
  );
};
