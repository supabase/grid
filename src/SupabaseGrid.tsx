import * as React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupaTable } from './types';
import Grid from './components/Grid';

export type SupabaseGridContextType = {
  client: SupabaseClient;
  table: SupaTable;
};

export const SupabaseGridCtx = React.createContext<SupabaseGridContextType | null>(
  null
);

export type SupabaseGridProps = {
  /**
   * database table swagger
   */
  table: SupaTable;
  /**
   * props to create client
   */
  clientProps: {
    supabaseUrl: string;
    supabaseKey: string;
    schema?: string;
    headers?: { [key: string]: string };
  };
  /**
   * props to config grid view
   */
  gridProps: {
    width?: number;
    height?: number;
  };
};

/**
 * Supabase Grid.
 *
 * React component to render database table.
 */
const SupabaseGrid: React.FunctionComponent<SupabaseGridProps> = p => {
  const { table, clientProps, gridProps } = p;
  const { supabaseUrl, supabaseKey, schema, headers } = clientProps;
  const client = new SupabaseClient(supabaseUrl, supabaseKey, {
    schema: schema,
    headers: headers,
  });
  const context: SupabaseGridContextType = { client, table };

  return (
    <SupabaseGridCtx.Provider value={context}>
      <Grid {...gridProps} />
    </SupabaseGridCtx.Provider>
  );
};
export default SupabaseGrid;
