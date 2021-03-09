import * as React from 'react';
import { Button, Input, IconXSquare } from '@supabase/ui';
import { DropdownControl } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';

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

type FilterRowProps = {
  filterIdx: number;
};

const FilterRow: React.FC<FilterRowProps> = ({ filterIdx }) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const filter = state.filters[filterIdx];
  const column = state.table?.columns.find(x => x.id === filter.columnId);
  const columnOptions =
    state.table?.columns?.map(x => {
      return { value: x.id, label: x.name };
    }) || [];

  function onClauseChange(clause: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, clause } },
    });
  }

  function onColumnChange(columnId: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, columnId } },
    });
  }

  function onConditionChange(condition: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, condition } },
    });
  }

  function onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, filter: event.target.value } },
    });
  }

  function onRemoveFilter() {
    dispatch({
      type: 'REMOVE_FILTER',
      payload: filterIdx,
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
        <Button className="mr-2" type="outline">
          {filter.clause}
        </Button>
      </DropdownControl>
      <DropdownControl
        className="z-20"
        options={columnOptions}
        onSelect={onColumnChange}
      >
        <Button className="mr-2" type="outline">
          {column?.name || ''}
        </Button>
      </DropdownControl>
      <DropdownControl
        className="z-20"
        options={filterConditionOptions}
        onSelect={onConditionChange}
      >
        <Button className="mr-2" type="outline">
          {filter.condition}
        </Button>
      </DropdownControl>
      <Input
        size="tiny"
        value={filter.filter}
        style={{ width: '7rem' }}
        onChange={onFilterChange}
      />
    </div>
  );
};
export default FilterRow;
