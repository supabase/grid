import React, { FC } from 'react';
import {
  Dropdown,
  Button,
  IconPlus,
  Typography,
  IconFilter,
  Divider,
  Popover,
} from '@supabase/ui';
import { useDispatch, useTrackedState } from '../../../store';
import FilterRow from './FilterRow';

const FilterPopover: FC = () => {
  const state = useTrackedState();
  const btnText =
    state.filters.length > 0
      ? `Filtered by ${state.filters.length} rule${
          state.filters.length > 1 ? 's' : ''
        }`
      : 'Filter';

  return (
    <Popover
      align="start"
      className="sb-grid-filter-popover"
      overlay={<Filter />}
    >
      <Button
        as={'span'}
        type="text"
        icon={<IconFilter />}
        style={{ padding: '4px 8px' }}
      >
        {btnText}
      </Button>
    </Popover>
  );
};
export default FilterPopover;

const Filter: FC = () => {
  const state = useTrackedState();
  const dispatch = useDispatch();

  function onAddFilter() {
    dispatch({
      type: 'ADD_FILTER',
      payload: {
        clause: 'where',
        columnName: state.table?.columns[0].name,
        condition: 'eq',
        filterText: '',
      },
    });
  }

  return (
    <div className="">
      <div>
        {state.filters.map((_, index) => (
          <FilterRow
            key={`filter-${index}`}
            filterIdx={index}
            now={Date.now()}
          />
        ))}
        {state.filters.length == 0 && (
          <Dropdown.Misc>
            <div className="sb-grid-filter-popover__misc">
              <Typography.Text>No filters applied to this view</Typography.Text>
              <Typography.Text
                small
                type="secondary"
                className="sb-grid-filter-popover__misc__text"
              >
                Add a column below to filter the view
              </Typography.Text>
            </div>
          </Dropdown.Misc>
        )}
      </div>
      <Divider light />
      <Dropdown.Misc>
        <Button icon={<IconPlus />} type="text" onClick={onAddFilter}>
          Add filter
        </Button>
      </Dropdown.Misc>
    </div>
  );
};
