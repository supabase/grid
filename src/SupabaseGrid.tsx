import * as React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { GridProps, SupaTable } from './types';
import { getSupaTable } from './utils/table';
import { SupabaseGridContextType, SupabaseGridCtx } from './constants';
import Header from './components/header/Header';
import Grid from './components/Grid';
import TableService from './services/TableService';
import styles from './style.module.css';

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
  gridProps?: GridProps;
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
      <div className={styles.gridContainer}>
        <Header />
        <Grid {...gridProps} />
      </div>
    </SupabaseGridCtx.Provider>
  );
};
export default SupabaseGrid;
