import update from 'immutability-helper';

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
    }
  | {
      type: 'MOVE_SORT';
      payload: { fromIndex: number; toIndex: number };
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
        sorts: update(state.sorts, { $push: [action.payload] }),
        refreshPageFlag: Date.now(),
      };
    case 'REMOVE_SORT':
      return {
        ...state,
        sorts: state.sorts.filter(x => x.columnId !== action.payload),
        refreshPageFlag: Date.now(),
      };
    case 'UPDATE_SORT':
      return {
        ...state,
        sorts: state.sorts.map(x => {
          if (x.columnId == action.payload.columnId) return action.payload;
          return x;
        }),
        refreshPageFlag: Date.now(),
      };
    case 'MOVE_SORT': {
      const moveItem = state.sorts[action.payload.fromIndex];
      return {
        ...state,
        sorts: update(state.sorts, {
          $splice: [
            [action.payload.fromIndex, 1],
            [action.payload.toIndex, 0, moveItem],
          ],
        }),
        refreshPageFlag: Date.now(),
      };
    }
    default:
      return state;
  }
};

export default SortReducer;
