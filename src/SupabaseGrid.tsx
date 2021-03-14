import './style.css';
import * as React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GridProps, SupaTable } from './types';
import { fetchTable } from './utils/table';
import { StoreProvider, useDispatch, useTrackedState } from './store';
import { fetchPage, getGridColumns, refreshPageDebounced } from './utils';
import { REFRESH_PAGE_IMMEDIATELY, STORAGE_KEY } from './constants';
import { InitialStateType } from './store/reducers';
import Grid, { ColumnHeader } from './components/grid';
import Header from './components/header';

export type SupabaseGridProps = {
  /**
   * database table swagger or table name
   */
  table: SupaTable | string;
  schema?: string;
  /**
   * storageRef is used to save state on localstorage
   */
  storageRef?: string;
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
export const SupabaseGrid: React.FC<SupabaseGridProps> = props => {
  return (
    <StoreProvider>
      <DndProvider backend={HTML5Backend}>
        <SupabaseGridLayout {...props} />
      </DndProvider>
    </StoreProvider>
  );
};

const SupabaseGridLayout: React.FC<SupabaseGridProps> = props => {
  const { schema, storageRef, clientProps, gridProps } = props;
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { supabaseUrl, supabaseKey, headers } = clientProps;
  const client = new SupabaseClient(supabaseUrl, supabaseKey, {
    schema: schema,
    headers: headers,
  });

  React.useEffect(() => {
    if (state.isInitialComplete && storageRef && state.table) {
      const config = {
        gridColumns: state.gridColumns,
        sorts: state.sorts,
        filters: state.filters,
      };
      const tableConfig = { [state.table.id]: config };
      const json = { [storageRef]: tableConfig };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
    }
  }, [
    state.table,
    state.isInitialComplete,
    state.gridColumns,
    state.sorts,
    state.filters,
    storageRef,
  ]);

  React.useEffect(() => {
    if (state.refreshPageFlag == REFRESH_PAGE_IMMEDIATELY) {
      fetchPage(state, dispatch);
    } else if (state.refreshPageFlag != 0) {
      refreshPageDebounced(state, dispatch);
    }
  }, [state.refreshPageFlag]);

  React.useEffect(() => {
    if (!state.client) dispatch({ type: 'INIT_CLIENT', payload: { client } });
  }, [state.client]);

  React.useEffect(() => {
    if (state.client && !state.table) initTable(props, state, dispatch);
  }, [state.client, state.table]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <Grid {...gridProps} />
    </div>
  );
};

function initTable(
  props: SupabaseGridProps,
  state: InitialStateType,
  dispatch: (value: any) => void
) {
  function onLoadStorage(storageRef: string) {
    const jsonStr = localStorage.getItem(STORAGE_KEY);
    if (!jsonStr) return;
    const json = JSON.parse(jsonStr);
    return json[storageRef];
  }

  function onInitTable(tableDef: SupaTable, gridProps?: GridProps) {
    const gridColumns = getGridColumns(
      tableDef,
      {
        defaultWidth: gridProps?.defaultColumnWidth,
      },
      ColumnHeader
    );

    let savedState;
    if (props.storageRef) savedState = onLoadStorage(props.storageRef);
    if (savedState) savedState = savedState[tableDef.id];
    console.log('savedState', savedState);

    dispatch({
      type: 'INIT_TABLE',
      payload: { table: tableDef, gridProps, gridColumns, savedState },
    });
  }

  if (typeof props.table === 'string') {
    fetchTable(state.tableService!, props.table, props.schema).then(res => {
      if (res) onInitTable(res, props.gridProps);
    });
  } else {
    onInitTable(props.table, props.gridProps);
  }
}
