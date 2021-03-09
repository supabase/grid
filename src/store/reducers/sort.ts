export interface SortInitialState {
  sorts: { columnId: string | number; order: string }[];
}

export const sortInitialState: SortInitialState = { sorts: [] };

type SORT_ACTIONTYPE =
  | {
      type: 'SET_SORTS';
      payload: { columnId: string | number; order: string }[];
    }
  | { type: 'ADD_SORT'; payload: { columnId: string | number; order: string } }
  | { type: 'REMOVE_SORT'; payload: string | number }
  | {
      type: 'UPDATE_SORT';
      payload: { columnId: string | number; order: string };
    };

const SortReducer = (state: SortInitialState, action: SORT_ACTIONTYPE) => {
  switch (action.type) {
    case 'SET_SORTS':
      return {
        ...state,
        sorts: action.payload,
      };
    case 'ADD_SORT':
      return {
        ...state,
        sorts: state.sorts.concat(action.payload),
      };
    case 'REMOVE_SORT':
      return {
        ...state,
        sorts: state.sorts.filter(x => x.columnId !== action.payload),
      };
    case 'UPDATE_SORT':
      return {
        ...state,
        sorts: state.sorts.map(x => {
          if (x.columnId == action.payload.columnId) return action.payload;
          return x;
        }),
      };
    default:
      return state;
  }
};

export default SortReducer;
