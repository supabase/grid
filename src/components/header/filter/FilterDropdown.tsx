import * as React from 'react';
import { Dropdown, Button, IconPlus, Typography } from '@supabase/ui';
import { useDispatch, useTrackedState } from '../../../store';
import FilterRow from './FilterRow';

type FilterDropdownProps = {};

const FilterDropdown: React.FC<FilterDropdownProps> = p => {
  const state = useTrackedState();
  const btnText =
    state.filters.length > 0 ? `Filter ${state.filters.length}` : 'Filter';

  return (
    <Dropdown
      className="w-96 overflow-visible"
      placement="bottomLeft"
      overlay={<Filter {...p} />}
    >
      <Button className="mr-2" type="secondary">
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
        columnId: state.table?.columns[0].id,
        condition: 'eq',
        filterText: '',
      },
    });
  }

  return (
    <div className="p-2">
      <div>
        {state.filters.map((_, index) => (
          <FilterRow key={`filter-${index}`} filterIdx={index} />
        ))}
        {state.filters.length == 0 && (
          <Typography.Text>No filters applied</Typography.Text>
        )}
      </div>
      <div className="mt-2">
        <Button icon={<IconPlus />} onClick={onAddFilter}>
          Add filter
        </Button>
      </div>
    </div>
  );
};
