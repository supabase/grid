import * as React from 'react';
import {
  Dropdown,
  Button,
  IconPlus,
  Typography,
  IconFilter,
  Divider,
} from '@supabase/ui';
import { useDispatch, useTrackedState } from '../../../store';
import FilterRow from './FilterRow';

type FilterDropdownProps = {};

const FilterDropdown: React.FC<FilterDropdownProps> = p => {
  const state = useTrackedState();
  const btnText =
    state.filters.length > 0
      ? `Filtered by ${state.filters.length} rule${
          state.filters.length > 1 ? 's' : ''
        }`
      : 'Filter';

  return (
    <Dropdown
      className="sb-grid-filter-dropdown"
      side="bottom"
      overlay={<Filter {...p} />}
    >
      <Button as={'span'} type="text" icon={<IconFilter />}>
        {btnText}
      </Button>
    </Dropdown>
  );
};
export default FilterDropdown;

const Filter: React.FC<FilterDropdownProps> = ({}) => {
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
            <div className="sb-grid-filter-dropdown__misc">
              <Typography.Text>No filters applied to this view</Typography.Text>
              <Typography.Text
                small
                type="secondary"
                className="sb-grid-filter-dropdown__misc__text"
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
