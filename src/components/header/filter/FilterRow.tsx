import * as React from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Button, Input, IconXSquare } from '@supabase/ui';
import { DropdownControl } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';
import { Filter } from '../../../types';

const filterClauseOptions = [
  { value: 'where', label: 'WHERE' },
  { value: 'and', label: 'AND' },
  { value: 'or', label: 'OR' },
];

const filterConditionOptions = [
  { value: 'eq', label: '[eq] equals' },
  { value: 'neq', label: '[neq] not equal' },
  { value: 'gt', label: '[gt] greater than' },
  { value: 'lt', label: '[lt] less than' },
  { value: 'gte', label: '[gte] greater than or equal' },
  { value: 'lte', label: '[lte]less than or equal' },
  { value: 'like', label: '[like] LIKE operato' },
  { value: 'ilike', label: '[ilike] ILIKE operator' },
  { value: 'is', label: '[is] checking for (null,true,false)' },
  { value: 'in', label: '[in] one of a list of values' },
];

const updateFilterText = (
  payload: {
    filterIdx: number;
    value: Filter;
  },
  dispatch: (value: unknown) => void
) => {
  dispatch({
    type: 'UPDATE_FILTER',
    payload: payload,
  });
};
const updateFilterTextDebounced = AwesomeDebouncePromise(updateFilterText, 550);

type FilterRowProps = {
  filterIdx: number;
};

const FilterRow: React.FC<FilterRowProps> = ({ filterIdx }) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const filter = state.filters[filterIdx];
  const column = state.table?.columns.find(x => x.name === filter.columnName);
  const columnOptions =
    state.table?.columns?.map(x => {
      return { value: x.name, label: x.name };
    }) || [];
  const [filterText, setFilterText] = React.useState(filter.filterText);

  function onClauseChange(clause: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, clause } },
    });
  }

  function onColumnChange(columnName: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, columnName } },
    });
  }

  function onConditionChange(condition: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, condition } },
    });
  }

  function onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setFilterText(value);
    updateFilterTextDebounced(
      {
        filterIdx,
        value: { ...filter, filterText: value },
      },
      dispatch
    );
  }

  function onRemoveFilter() {
    dispatch({
      type: 'REMOVE_FILTER',
      payload: { index: filterIdx },
    });
  }

  return (
    <div className="flex items-center py-1">
      <Button
        className="mr-2 p-2"
        icon={<IconXSquare />}
        shadow={false}
        size="tiny"
        type="text"
        onClick={onRemoveFilter}
      />
      <DropdownControl
        className="z-20"
        options={filterClauseOptions}
        onSelect={onClauseChange}
      >
        <Button as="span" className="mr-2" type="outline">
          {filter.clause}
        </Button>
      </DropdownControl>
      <DropdownControl
        className="z-20"
        options={columnOptions}
        onSelect={onColumnChange}
      >
        <Button as="span" className="mr-2" type="outline">
          {column?.name || ''}
        </Button>
      </DropdownControl>
      <DropdownControl
        className="z-20"
        options={filterConditionOptions}
        onSelect={onConditionChange}
      >
        <Button as="span" className="mr-2" type="outline">
          {filter.condition}
        </Button>
      </DropdownControl>
      <Input
        size="tiny"
        value={filterText}
        style={{ width: '7rem' }}
        onChange={onFilterChange}
      />
    </div>
  );
};
export default FilterRow;
