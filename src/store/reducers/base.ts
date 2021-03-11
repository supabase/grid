import { Column } from 'react-data-grid';
import { SupabaseClient } from '@supabase/supabase-js';
import { GridProps, SupaTable } from '../../types';
import RowService from '../../services/RowService';
import TableService from '../../services/TableService';

export interface BaseInitialState {
  client: SupabaseClient | null;
  table: SupaTable | null;
  tableService: TableService | null;
  rowService: RowService | null;
  refreshPageFlag: number;
}

export const baseInitialState: BaseInitialState = {
  client: null,
  table: null,
  tableService: null,
  rowService: null,
  refreshPageFlag: 0,
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
        gridProps?: GridProps;
        gridColumns: Column<any, any>[];
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
      };
    }
    default:
      return state;
  }
};

export default BaseReducer;
