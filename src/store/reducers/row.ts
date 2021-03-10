import { Dictionary } from '../../types';
import { getDefaultSorts } from '../../utils';
import { INIT_ACTIONTYPE } from './base';

export interface RowInitialState {
  rows: Dictionary<any>[];
  page: number;
  rowsPerPage: number;
}

export const rowInitialState: RowInitialState = {
  rows: [],
  page: 1,
  rowsPerPage: 100,
};

type ROW_ACTIONTYPE =
  | INIT_ACTIONTYPE
  | {
      type: 'SET_ROWS';
      payload: Dictionary<any>[];
    }
  | { type: 'ADD_ROWS'; payload: Dictionary<any>[] }
  | { type: 'ADD_NEW_ROW'; payload: Dictionary<any> }
  | { type: 'REMOVE_ROWS'; payload: string[] | number[] };

const RowReducer = (state: RowInitialState, action: ROW_ACTIONTYPE) => {
  switch (action.type) {
    case 'INIT_STATE': {
      return {
        ...state,
        sorts: getDefaultSorts(action.payload.table),
      };
    }
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
    case 'ADD_NEW_ROW':
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
