import React, { FC } from 'react';
import {
  Dropdown,
  Button,
  Typography,
  IconList,
  IconChevronDown,
  Divider,
  Popover,
} from '@supabase/ui';
import { DropdownControl } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';
import SortRow from './SortRow';

const SortPopover: FC = () => {
  const state = useTrackedState();
  const btnText =
    state.sorts.length > 0
      ? `Sorted by ${state.sorts.length} rule${
          state.sorts.length > 1 ? 's' : ''
        }`
      : 'Sort';

  return (
    <Popover align="start" className="sb-grid-sort-popover" overlay={<Sort />}>
      <Button
        as={'span'}
        type="text"
        icon={<IconList />}
        style={{ padding: '4px 8px' }}
      >
        {btnText}
      </Button>
    </Popover>
  );
};
export default SortPopover;

const Sort: FC = () => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const columns = state?.table?.columns!.filter((x) => {
    const found = state.sorts.find((y) => y.columnName == x.name);
    return !found;
  });
  const dropdownOptions =
    columns?.map((x) => {
      return { value: x.name, label: x.name };
    }) || [];

  function onAddSort(columnName: string | number) {
    dispatch({
      type: 'ADD_SORT',
      payload: { columnName, ascending: true },
    });
  }

  return (
    <div>
      {state.sorts.map((x, index) => (
        <SortRow key={x.columnName} columnName={x.columnName} index={index} />
      ))}
      {state.sorts.length == 0 && (
        <Dropdown.Misc>
          <div className="sb-grid-dropdown__empty">
            <Typography.Text>No sorts applied to this view</Typography.Text>
            <Typography.Text
              small
              type="secondary"
              className="sb-grid-dropdown__empty__text"
            >
              Add a column below to sort the view
            </Typography.Text>
          </div>
        </Dropdown.Misc>
      )}

      <Divider light />
      <Dropdown.Misc>
        {columns && columns.length > 0 ? (
          <DropdownControl
            options={dropdownOptions}
            onSelect={onAddSort}
            side="bottom"
            align="start"
          >
            <Button
              as="span"
              type="text"
              iconRight={<IconChevronDown />}
              className="sb-grid-dropdown__item-trigger"
            >
              {`Pick ${
                state.sorts.length > 1 ? 'another' : 'a'
              } column to sort by`}
            </Button>
          </DropdownControl>
        ) : (
          <Typography.Text small type="secondary">
            All columns have been added
          </Typography.Text>
        )}
      </Dropdown.Misc>
    </div>
  );
};
