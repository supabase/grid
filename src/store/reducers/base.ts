import { SupabaseClient } from '@supabase/supabase-js';
import { Column } from 'react-data-grid';
import { SupaTable } from '../../types';

export interface BaseInitialState {
  client: SupabaseClient | null;
  table: SupaTable | null;
  gridColumns: Column<any, any>[];
}

export const baseInitialState: BaseInitialState = {
  client: null,
  table: null,
  gridColumns: [],
};

type BASE_ACTIONTYPE =
  | {
      type: 'INIT_BASE';
      payload: { client: SupabaseClient; table: SupaTable };
    }
  | { type: 'SET_GRID_COLUMNS'; payload: Column<any, any>[] };

const BaseReducer = (state: BaseInitialState, action: BASE_ACTIONTYPE) => {
  switch (action.type) {
    case 'INIT_BASE': {
      return {
        ...state,
        client: action.payload.client,
        table: action.payload.table,
      };
    }
    case 'SET_GRID_COLUMNS':
      return {
        ...state,
        gridColumns: action.payload,
      };
    default:
      return state;
  }
};

export default BaseReducer;
