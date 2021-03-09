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
      payload: {
        clause: string;
        columnId: string | number;
        condition: string;
        filter: string;
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
        filters: state.filters.filter(
          x =>
            x.clause !== action.payload.clause &&
            x.columnId !== action.payload.columnId &&
            x.condition !== action.payload.condition &&
            x.filter !== action.payload.filter
        ),
      };
    default:
      return state;
  }
};

export default FilterReducer;
