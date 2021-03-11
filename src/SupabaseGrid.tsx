import './style.css';
import * as React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GridProps, SupaTable } from './types';
import { fetchTable } from './utils/table';
import { StoreProvider, useDispatch, useTrackedState } from './store';
import Grid, { ColumnHeader } from './components/grid';
import Header from './components/header';
import { getGridColumns } from './utils';

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
      <DndProvider backend={HTML5Backend}>
        <SupabaseGridLayout {...props} />
      </DndProvider>
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
    function initTable(tableDef: SupaTable, gridProps?: GridProps) {
      const gridColumns = getGridColumns(
        tableDef,
        {
          defaultWidth: gridProps?.defaultColumnWidth,
        },
        ColumnHeader
      );
      dispatch({
        type: 'INIT_TABLE',
        payload: { table: tableDef, gridProps, gridColumns },
      });
    }

    if (!state.client || state.table) return;

    if (typeof table === 'string') {
      fetchTable(state.tableService!, table, schema).then(res => {
        if (res) initTable(res, gridProps);
      });
    } else {
      initTable(table, gridProps);
    }
  }, [state, dispatch]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <Grid {...gridProps} />
    </div>
  );
};
