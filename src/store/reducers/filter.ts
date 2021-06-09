import update from 'immutability-helper';
import { Filter } from '../../types';
import { getInitialFilters } from '../../utils';
import { INIT_ACTIONTYPE } from './base';

export interface FilterInitialState {
  filters: Filter[];
}

export const filterInitialState: FilterInitialState = { filters: [] };

type FILTER_ACTIONTYPE =
  | INIT_ACTIONTYPE
  | {
      type: 'SET_FILTERS';
      payload: Filter[];
    }
  | {
      type: 'ADD_FILTER';
      payload: Filter;
    }
  | {
      type: 'REMOVE_FILTER';
      payload: { index: number };
    }
  | {
      type: 'UPDATE_FILTER';
      payload: {
        filterIdx: number;
        value: Filter;
      };
    };

const FilterReducer = (
  state: FilterInitialState,
  action: FILTER_ACTIONTYPE
) => {
  switch (action.type) {
    case 'INIT_TABLE': {
      return {
        ...state,
        filters: getInitialFilters(
          action.payload.table,
          action.payload.savedState
        ),
      };
    }
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    case 'ADD_FILTER': {
      const isValid = isValidFilter(action.payload);
      return {
        ...state,
        filters: update(state.filters, { $push: [action.payload] }),
        page: isValid ? 1 : state.page,
        refreshPageFlag: isValid ? Date.now() : 0,
      };
    }
    case 'REMOVE_FILTER': {
      const removeIdx = action.payload.index;
      const removeFilter = state.filters[removeIdx];
      const isValid = isValidFilter(removeFilter);
      return {
        ...state,
        filters: update(state.filters, {
          $splice: [[removeIdx, 1]],
        }),
        page: isValid ? 1 : state.page,
        refreshPageFlag: isValid ? Date.now() : 0,
      };
    }
    case 'UPDATE_FILTER': {
      const updatedFilter = state.filters[action.payload.filterIdx];
      const previousIsValid = isValidFilter(updatedFilter);
      const afterIsValid = isValidFilter(action.payload.value);
      return {
        ...state,
        filters: update(state.filters, {
          [action.payload.filterIdx]: { $set: action.payload.value },
        }),
        page: afterIsValid ? 1 : state.page,
        refreshPageFlag: previousIsValid || afterIsValid ? Date.now() : 0,
      };
    }
    default:
      return state;
  }
};

export default FilterReducer;

function isValidFilter(value: Filter) {
  return (
    value &&
    value.columnName &&
    value.columnName != '' &&
    value.filterText &&
    value.filterText != ''
  );
}
