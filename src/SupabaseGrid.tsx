import './style.css';
import * as React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { GridProps, SupaTable } from './types';
import { getSupaTable } from './utils/table';
import { StoreProvider, useDispatch, useTrackedState } from './store';
import Header from './components/header';
import Grid from './components/Grid';

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
const SupabaseGrid: React.FC<SupabaseGridProps> = props => {
  return (
    <StoreProvider>
      <SupabaseGridLayout {...props} />
    </StoreProvider>
  );
};
export default SupabaseGrid;

const SupabaseGridLayout: React.FC<SupabaseGridProps> = ({
  table,
  schema,
  clientProps,
  gridProps,
}) => {
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { supabaseUrl, supabaseKey, headers } = clientProps;
  const client = new SupabaseClient(supabaseUrl, supabaseKey, {
    schema: schema,
    headers: headers,
  });

  React.useEffect(() => {
    if (!state.client) dispatch({ type: 'INIT_CLIENT', payload: { client } });
  }, [state]);

  React.useEffect(() => {
    async function fetch() {
      const resTable = await state.tableService!.fetch(table as string, schema);
      const resColumns = await state.tableService!.fetchColumns(
        table as string,
        schema
      );
      if (
        resTable.data &&
        resColumns.data &&
        resTable.data.length > 0 &&
        resColumns.data.length > 0
      ) {
        const supaTable = getSupaTable(resTable.data[0], resColumns.data);

        dispatch({
          type: 'INIT_TABLE',
          payload: { table: supaTable, gridProps },
        });
      }
    }

    if (!state.client || state.table) return;

    if (typeof table === 'string') {
      if (state.client) fetch();
    } else {
      dispatch({ type: 'INIT_TABLE', payload: { table, gridProps } });
    }
  }, [state, dispatch]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <Grid {...gridProps} />
    </div>
  );
};
