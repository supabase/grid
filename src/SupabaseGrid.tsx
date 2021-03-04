import * as React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupaTable } from './types';
import Grid from './components/Grid';
import TableService from './services/TableService';
import { getSupaTable } from './utils/table';

export type SupabaseGridContextType = {
  client: SupabaseClient;
  table: SupaTable | undefined;
};

export const SupabaseGridCtx = React.createContext<SupabaseGridContextType | null>(
  null
);

export type SupabaseGridProps = {
  /**
   * database table swagger or table name
   */
  table: SupaTable | string;
  schema?: string;
  /**
   * props to create client
   */
  clientProps: {
    supabaseUrl: string;
    supabaseKey: string;
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
const SupabaseGrid: React.FunctionComponent<SupabaseGridProps> = ({
  table,
  schema,
  clientProps,
  gridProps,
}) => {
  const { supabaseUrl, supabaseKey, headers } = clientProps;
  const client = new SupabaseClient(supabaseUrl, supabaseKey, {
    schema: schema,
    headers: headers,
  });
  const [
    contextValue,
    setContext,
  ] = React.useState<SupabaseGridContextType | null>(null);

  React.useEffect(() => {
    async function fetch() {
      const service = new TableService(client);
      const resTable = await service.fetch(table as string, schema);
      const resColumns = await service.fetchColumns(table as string, schema);
      if (
        resTable.data &&
        resColumns.data &&
        resTable.data.length > 0 &&
        resColumns.data.length > 0
      ) {
        const supaTable = getSupaTable(resTable.data[0], resColumns.data);
        console.log('supaTable', supaTable);
        setContext({ client, table: supaTable });
      }
    }

    if (contextValue) return;
    if (typeof table === 'string') {
      fetch();
    } else {
      setContext({ client, table });
    }
  }, [contextValue]);

  return (
    <SupabaseGridCtx.Provider value={contextValue}>
      <Grid {...gridProps} />
    </SupabaseGridCtx.Provider>
  );
};
export default SupabaseGrid;
