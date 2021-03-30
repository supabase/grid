import { Column } from '@phamhieu1998/react-data-grid';
import { SupabaseClient } from '@supabase/supabase-js';
import { GridProps, SavedState, SupaTable } from '../../types';
import { REFRESH_PAGE_IMMEDIATELY } from '../../constants';
import RowService from '../../services/RowService';
import TableService from '../../services/TableService';
import OpenApiService from '../../services/OpenApiService';

export interface BaseInitialState {
  client: SupabaseClient | null;
  openApiService: OpenApiService | null;
  table: SupaTable | null;
  tableService: TableService | null;
  rowService: RowService | null;
  refreshPageFlag: number;
  isInitialComplete: boolean;
  editable: boolean;
}

export const baseInitialState: BaseInitialState = {
  client: null,
  openApiService: null,
  table: null,
  tableService: null,
  rowService: null,
  refreshPageFlag: 0,
  isInitialComplete: false,
  editable: false,
};

export type INIT_ACTIONTYPE =
  | {
      type: 'INIT_CLIENT';
      payload: {
        supabaseUrl: string;
        supabaseKey: string;
        schema?: string;
        headers?: { [key: string]: string };
      };
    }
  | {
      type: 'INIT_TABLE';
      payload: {
        table: SupaTable;
        gridColumns: Column<any, any>[];
        gridProps?: GridProps;
        savedState?: SavedState;
        editable?: boolean;
      };
    };

type BASE_ACTIONTYPE = INIT_ACTIONTYPE;

const BaseReducer = (state: BaseInitialState, action: BASE_ACTIONTYPE) => {
  switch (action.type) {
    case 'INIT_CLIENT': {
      const { supabaseUrl, supabaseKey, headers, schema } = action.payload;
      const client = new SupabaseClient(supabaseUrl, supabaseKey, {
        schema: schema,
        headers: headers,
      });
      const openApiService = new OpenApiService(supabaseUrl, supabaseKey);
      return {
        ...state,
        client,
        openApiService,
        tableService: new TableService(client),
      };
    }
    case 'INIT_TABLE': {
      return {
        ...state,
        table: action.payload.table,
        rowService: new RowService(action.payload.table, state.client!),
        refreshPageFlag: REFRESH_PAGE_IMMEDIATELY,
        isInitialComplete: true,
        editable: action.payload.editable || false,
      };
    }
    default:
      return state;
  }
};

export default BaseReducer;
