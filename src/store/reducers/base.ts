import { Column } from 'react-data-grid';
import { SupabaseClient } from '@supabase/supabase-js';
import { GridProps, SavedState, SupaTable } from '../../types';
import RowService from '../../services/RowService';
import TableService from '../../services/TableService';
import { REFRESH_PAGE_IMMEDIATELY } from '../../constants';

export interface BaseInitialState {
  client: SupabaseClient | null;
  table: SupaTable | null;
  tableService: TableService | null;
  rowService: RowService | null;
  refreshPageFlag: number;
  isInitialComplete: boolean;
}

export const baseInitialState: BaseInitialState = {
  client: null,
  table: null,
  tableService: null,
  rowService: null,
  refreshPageFlag: 0,
  isInitialComplete: false,
};

export type INIT_ACTIONTYPE =
  | {
      type: 'INIT_CLIENT';
      payload: {
        client: SupabaseClient;
      };
    }
  | {
      type: 'INIT_TABLE';
      payload: {
        table: SupaTable;
        gridColumns: Column<any, any>[];
        gridProps?: GridProps;
        savedState?: SavedState;
      };
    };

type BASE_ACTIONTYPE = INIT_ACTIONTYPE;

const BaseReducer = (state: BaseInitialState, action: BASE_ACTIONTYPE) => {
  switch (action.type) {
    case 'INIT_CLIENT': {
      return {
        ...state,
        client: action.payload.client,
        tableService: new TableService(action.payload.client),
      };
    }
    case 'INIT_TABLE': {
      return {
        ...state,
        table: action.payload.table,
        rowService: new RowService(action.payload.table, state.client!),
        refreshPageFlag: REFRESH_PAGE_IMMEDIATELY,
        isInitialComplete: true,
      };
    }
    default:
      return state;
  }
};

export default BaseReducer;
