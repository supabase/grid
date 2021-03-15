import * as React from 'react';
import { Dropdown, Button, Typography } from '@supabase/ui';
import { DropdownControl } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';
import SortRow from './SortRow';

type SortDropdownProps = {};

const SortDropdown: React.FC<SortDropdownProps> = p => {
  const state = useTrackedState();
  const btnText =
    state.sorts.length > 0 ? `Sort ${state.sorts.length}` : 'Sort';

  return (
    <Dropdown
      className="w-80 overflow-visible"
      placement="bottomLeft"
      overlay={<Sort {...p} />}
    >
      <Button
        type="outline"
        style={{ padding: '3px 10px', borderColor: '#333' }}
      >
        {btnText}
      </Button>
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
  const dropdownOptions =
    columns?.map(x => {
      return { value: x.id, label: x.name };
    }) || [];

  function onAddSort(columnId: string | number) {
    dispatch({
      type: 'ADD_SORT',
      payload: { columnId, order: 'ASC' },
    });
  }

  return (
    <div className="p-2">
      {state.sorts.map((x, index) => (
        <SortRow key={x.columnId} columnId={x.columnId} index={index} />
      ))}
      {state.sorts.length == 0 && (
        <div>
          <Typography.Text>No sorts applied</Typography.Text>
        </div>
      )}
      <div className="mt-2">
        <DropdownControl options={dropdownOptions} onSelect={onAddSort}>
          <Button>Pick another column to sort by</Button>
        </DropdownControl>
      </div>
    </div>
  );
};
