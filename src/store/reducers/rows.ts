import { Dictionary } from '../../types';

export interface RowInitialState {
  rows: Dictionary<any>[];
}

export const rowInitialState: RowInitialState = { rows: [] };

type ROW_ACTIONTYPE =
  | {
      type: 'SET_ROWS';
      payload: Dictionary<any>[];
    }
  | { type: 'ADD_ROWS'; payload: Dictionary<any> }
  | { type: 'REMOVE_ROWS'; payload: string[] | number[] };

const RowReducer = (state: RowInitialState, action: ROW_ACTIONTYPE) => {
  switch (action.type) {
    case 'SET_ROWS':
      return {
        ...state,
        rows: action.payload,
      };
    case 'ADD_ROWS':
      return {
        ...state,
        rows: state.rows.concat(action.payload),
      };
    case 'REMOVE_ROWS': {
      return {
        ...state,
        rows: state.rows.filter(x => !action.payload.includes(x.id as never)),
      };
    }
    default:
      return state;
  }
};

export default RowReducer;
