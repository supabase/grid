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
      const result: any = {
        ...state,
        filters: update(state.filters, { $push: [action.payload] }),
      };
      if (isValid) {
        result.refreshPageFlag = Date.now();
        result.page = 1;
      }
      return result;
    }
    case 'REMOVE_FILTER': {
      const removeIdx = action.payload.index;
      const removeFilter = state.filters[removeIdx];
      const isValid = isValidFilter(removeFilter);
      const result: any = {
        ...state,
        filters: update(state.filters, {
          $splice: [[removeIdx, 1]],
        }),
      };
      if (isValid) {
        result.refreshPageFlag = Date.now();
        result.page = 1;
      }
      return result;
    }
    case 'UPDATE_FILTER': {
      const updatedFilter = state.filters[action.payload.filterIdx];
      const previousIsValid = isValidFilter(updatedFilter);
      const afterIsValid = isValidFilter(action.payload.value);
      const result: any = {
        ...state,
        filters: update(state.filters, {
          [action.payload.filterIdx]: { $set: action.payload.value },
        }),
      };
      if (previousIsValid || afterIsValid) {
        result.refreshPageFlag = Date.now();
        result.page = 1;
      }
      return result;
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
