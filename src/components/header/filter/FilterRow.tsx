import * as React from 'react';
import { Button, Input, Dropdown, IconX, IconChevronDown } from '@supabase/ui';
import { DropdownControl } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';
import { FilterOperatorOptions } from './Filter.constants';
import { updateFilterValueDebounced } from './Filter.utils';

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
  const column = state.table?.columns.find((x) => x.name === filter.column);
  const columnOptions =
    state.table?.columns?.map((x) => {
      return { value: x.name, label: x.name };
    }) || [];
  const functionsOptions = [
    { value: '', label: 'none' },
    ...state.allowedFunctions.map((f) => ({
      value: f,
      label: f,
    })),
  ];
  const [filterValue, setFilterValue] = React.useState(filter.value);

  React.useEffect(() => {
    const filter = state.filters[filterIdx];
    setFilterValue(filter.value);
  }, [filterIdx, now]);

  function onColumnChange(column: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, column } },
    });
  }

  function onOperatorChange(operator: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, operator } },
    });
  }

  function onFunctionChange(func: string | number) {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { filterIdx, value: { ...filter, func } },
    });
  }

  function onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setFilterValue(value);
    updateFilterValueDebounced(
      {
        filterIdx,
        value: { ...filter, value: value },
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
            options={columnOptions}
            onSelect={onColumnChange}
          >
            <Button as="span" type="outline" iconRight={<IconChevronDown />}>
              {column?.name || ''}
            </Button>
          </DropdownControl>
          <DropdownControl
            align="start"
            options={FilterOperatorOptions}
            onSelect={onOperatorChange}
          >
            <Button as="span" type="outline" iconRight={<IconChevronDown />}>
              {filter.operator}
            </Button>
          </DropdownControl>
          {functionsOptions.length > 1 && (
            <DropdownControl
              align="start"
              options={functionsOptions}
              onSelect={onFunctionChange}
            >
              <Button as="span" type="outline" iconRight={<IconChevronDown />}>
                {filter.func || ''}
              </Button>
            </DropdownControl>
          )}
        </div>
        <div>
          <Input size="tiny" value={filterValue} onChange={onFilterChange} />
        </div>
      </div>
    </Dropdown.Misc>
  );
};
export default React.memo(FilterRow);
