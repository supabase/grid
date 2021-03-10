export interface FilterInitialState {
  filters: {
    clause: string;
    columnId: string | number;
    condition: string;
    filterText: string;
  }[];
}

export const filterInitialState: FilterInitialState = { filters: [] };

type FILTER_ACTIONTYPE =
  | {
      type: 'SET_FILTERS';
      payload: {
        clause: string;
        columnId: string | number;
        condition: string;
        filterText: string;
      }[];
    }
  | {
      type: 'ADD_FILTER';
      payload: {
        clause: string;
        columnId: string | number;
        condition: string;
        filterText: string;
      };
    }
  | {
      type: 'REMOVE_FILTER';
      payload: number;
    }
  | {
      type: 'UPDATE_FILTER';
      payload: {
        filterIdx: number;
        value: {
          clause: string;
          columnId: string | number;
          condition: string;
          filterText: string;
        };
      };
    };

const FilterReducer = (
  state: FilterInitialState,
  action: FILTER_ACTIONTYPE
) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    case 'ADD_FILTER': {
      const isValid = isValidFilter(action.payload);
      return {
        ...state,
        filters: state.filters.concat(action.payload),
        refreshPageFlag: isValid ? Date.now() : 0,
      };
    }
    case 'REMOVE_FILTER': {
      const removeFilter = state.filters[action.payload];
      const isValid = isValidFilter(removeFilter);
      return {
        ...state,
        filters: [
          ...state.filters.slice(0, action.payload),
          ...state.filters.slice(action.payload + 1),
        ],
        refreshPageFlag: isValid ? Date.now() : 0,
      };
    }
    case 'UPDATE_FILTER': {
      const updatedFilter = state.filters[action.payload.filterIdx];
      const previousIsValid = isValidFilter(updatedFilter);
      const afterIsValid = isValidFilter(action.payload.value);
      return {
        ...state,
        filters: state.filters.map((x, idx) => {
          if (idx == action.payload.filterIdx) return action.payload.value;
          return x;
        }),
        refreshPageFlag: previousIsValid || afterIsValid ? Date.now() : 0,
      };
    }
    default:
      return state;
  }
};

export default FilterReducer;

function isValidFilter(value: {
  clause: string;
  columnId: string | number;
  condition: string;
  filterText: string;
}) {
  return (
    value &&
    value.columnId &&
    value.columnId != '' &&
    value.filterText &&
    value.filterText != ''
  );
}
