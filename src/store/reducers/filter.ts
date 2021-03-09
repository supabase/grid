export interface FilterInitialState {
  filters: {
    clause: string;
    columnId: string | number;
    condition: string;
    filter: string;
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
        filter: string;
      }[];
    }
  | {
      type: 'ADD_FILTER';
      payload: {
        clause: string;
        columnId: string | number;
        condition: string;
        filter: string;
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
          filter: string;
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
    case 'ADD_FILTER':
      return {
        ...state,
        filters: state.filters.concat(action.payload),
      };
    case 'REMOVE_FILTER':
      return {
        ...state,
        filters: [
          ...state.filters.slice(0, action.payload),
          ...state.filters.slice(action.payload + 1),
        ],
      };
    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: state.filters.map((x, idx) => {
          if (idx == action.payload.filterIdx) return action.payload.value;
          return x;
        }),
      };
    default:
      return state;
  }
};

export default FilterReducer;
