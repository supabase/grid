import update from 'immutability-helper';
import { REFRESH_PAGE_IMMEDIATELY } from '../../constants';
import { Dictionary, SupaRow } from '../../types';
import { INIT_ACTIONTYPE } from './base';

export interface RowInitialState {
  rows: SupaRow[];
  selectedRows: Set<React.Key>;
  page: number;
  rowsPerPage: number;
  totalRows: number;
}

export const rowInitialState: RowInitialState = {
  rows: [],
  selectedRows: new Set<React.Key>(),
  page: 1,
  rowsPerPage: 100,
  totalRows: 0,
};

type ROW_ACTIONTYPE =
  | INIT_ACTIONTYPE
  | {
      type: 'SELECTED_ROWS_CHANGE';
      payload: { selectedRows: Set<React.Key> };
    }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_ROWS_PER_PAGE'; payload: number }
  | {
      type: 'SET_ROWS';
      payload: { rows: SupaRow[]; totalRows: number };
    }
  | { type: 'ADD_ROWS'; payload: SupaRow[] }
  | { type: 'ADD_NEW_ROW'; payload: Dictionary<any> }
  | { type: 'EDIT_ROW'; payload: { row: Dictionary<any>; idx: number } }
  | { type: 'REMOVE_ROWS'; payload: { rowIdxs: number[] } };

const RowReducer = (state: RowInitialState, action: ROW_ACTIONTYPE) => {
  switch (action.type) {
    case 'INIT_TABLE': {
      return {
        ...state,
        page: 1,
        selectedRows: new Set<React.Key>(),
      };
    }
    case 'SELECTED_ROWS_CHANGE': {
      return {
        ...state,
        selectedRows: action.payload.selectedRows,
      };
    }
    case 'SET_PAGE': {
      return {
        ...state,
        page: action.payload,
        refreshPageFlag: REFRESH_PAGE_IMMEDIATELY,
      };
    }
    case 'SET_ROWS_PER_PAGE': {
      return {
        ...state,
        rowsPerPage: action.payload,
        refreshPageFlag: REFRESH_PAGE_IMMEDIATELY,
      };
    }
    case 'SET_ROWS':
      return {
        ...state,
        rows: action.payload.rows,
        totalRows: action.payload.totalRows,
        refreshPageFlag: 0,
      };
    case 'ADD_ROWS': {
      const totalRows = state.totalRows + action.payload.length;
      return {
        ...state,
        rows: update(state.rows, { $push: action.payload }),
        totalRows: totalRows,
      };
    }
    case 'ADD_NEW_ROW': {
      const supaRow = { ...action.payload, idx: state.rows.length };
      const totalRows = state.totalRows + 1;
      return {
        ...state,
        rows: update(state.rows, { $push: [supaRow] }),
        totalRows: totalRows,
      };
    }
    case 'EDIT_ROW': {
      const supaRow = { ...action.payload.row, idx: action.payload.idx };
      return {
        ...state,
        rows: update(state.rows, {
          [action.payload.idx]: { $set: supaRow },
        }),
      };
    }
    case 'REMOVE_ROWS': {
      const totalRows = state.totalRows - action.payload.rowIdxs.length;
      return {
        ...state,
        rows: state.rows.filter(x => !action.payload.rowIdxs.includes(x.idx)),
        totalRows: totalRows,
      };
    }
    default:
      return state;
  }
};

export default RowReducer;
