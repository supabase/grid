import { SupabaseClient } from '@supabase/supabase-js';
import { GridProps, SupaTable } from '../../types';

export interface BaseInitialState {
  client: SupabaseClient | null;
  table: SupaTable | null;
}

export const baseInitialState: BaseInitialState = {
  client: null,
  table: null,
};

export type INIT_ACTIONTYPE = {
  type: 'INIT_STATE';
  payload: { client: SupabaseClient; table: SupaTable; gridProps?: GridProps };
};

type BASE_ACTIONTYPE = INIT_ACTIONTYPE;

const BaseReducer = (state: BaseInitialState, action: BASE_ACTIONTYPE) => {
  switch (action.type) {
    case 'INIT_STATE': {
      return {
        ...state,
        client: action.payload.client,
        table: action.payload.table,
      };
    }
    default:
      return state;
  }
};

export default BaseReducer;
