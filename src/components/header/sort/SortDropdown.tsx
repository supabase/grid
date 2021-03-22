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
        className="ml-2"
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
    const found = state.sorts.find(y => y.columnName == x.name);
    return !found;
  });
  const dropdownOptions =
    columns?.map(x => {
      return { value: x.name, label: x.name };
    }) || [];

  function onAddSort(columnName: string | number) {
    dispatch({
      type: 'ADD_SORT',
      payload: { columnName, order: 'ASC' },
    });
  }

  return (
    <div className="p-2">
      {state.sorts.map((x, index) => (
        <SortRow key={x.columnName} columnName={x.columnName} index={index} />
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
