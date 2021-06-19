import * as React from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Button, Input, Dropdown, IconX, IconChevronDown } from '@supabase/ui';
import { DropdownControl } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';
import { Filter } from '../../../types';

const FilterClauseOptions = [
  { value: 'where', label: 'WHERE' },
  { value: 'and', label: 'AND' },
  { value: 'or', label: 'OR' },
];

export const FilterConditionOptions = [
  { value: 'eq', label: '[eq] equals' },
  { value: 'neq', label: '[neq] not equal' },
  { value: 'gt', label: '[gt] greater than' },
  { value: 'lt', label: '[lt] less than' },
  { value: 'gte', label: '[gte] greater than or equal' },
  { value: 'lte', label: '[lte]less than or equal' },
  { value: 'like', label: '[like] LIKE operator' },
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

/**
 * use `now` to trigger re-render as filterIdx won't change value
 * if not filterText state will not updated on delete filter
 */
type FilterRowProps = {
  filterIdx: number;
  now: number;
};

const FilterRow: React.FC<FilterRowProps> = ({ filterIdx, now }) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const filter = state.filters[filterIdx];
  const column = state.table?.columns.find(x => x.name === filter.columnName);
  const columnOptions =
    state.table?.columns?.map(x => {
      return { value: x.name, label: x.name };
    }) || [];
  const [filterText, setFilterText] = React.useState(filter.filterText);

  React.useEffect(() => {
    const filter = state.filters[filterIdx];
    setFilterText(filter.filterText);
  }, [filterIdx, now]);

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
    <Dropdown.Misc>
      <div className="sb-grid-filter-row">
        <div className="sb-grid-filter-row__inner">
          <Button
            icon={<IconX />}
            className="sb-grid-filter-row__inner__close"
            shadow={false}
            size="tiny"
            type="text"
            onClick={onRemoveFilter}
          />
          <DropdownControl
            align="start"
            options={FilterClauseOptions}
            onSelect={onClauseChange}
          >
            <Button as="span" type="outline" iconRight={<IconChevronDown />}>
              {filter.clause}
            </Button>
          </DropdownControl>
          <DropdownControl
            align="start"
            options={columnOptions}
            onSelect={onColumnChange}
          >
            <Button as="span" type="outline" iconRight={<IconChevronDown />}>
              {column?.name || ''}
            </Button>
          </DropdownControl>
          <DropdownControl
            align="start"
            options={FilterConditionOptions}
            onSelect={onConditionChange}
          >
            <Button as="span" type="outline" iconRight={<IconChevronDown />}>
              {filter.condition}
            </Button>
          </DropdownControl>
        </div>
        <div>
          <Input size="tiny" value={filterText} onChange={onFilterChange} />
        </div>
      </div>
    </Dropdown.Misc>
  );
};
export default React.memo(FilterRow);
