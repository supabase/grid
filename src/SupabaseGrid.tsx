import './style.css';
import * as React from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useMonaco } from '@monaco-editor/react';
import { createPortal } from 'react-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Dictionary,
  SupabaseGridProps,
  SupabaseGridRef,
  SupaTable,
} from './types';
import { fetchReadonlyTableInfo, fetchTableInfo } from './utils/table';
import { StoreProvider, useDispatch, useTrackedState } from './store';
import { fetchPage, getStorageKey, refreshPageDebounced } from './utils';
import { REFRESH_PAGE_IMMEDIATELY, STORAGE_KEY_PREFIX } from './constants';
import { RowMenu, MultiRowsMenu } from './components/menu';
import { InitialStateType } from './store/reducers';
import { getGridColumns } from './utils/gridColumns';
import { Grid } from './components/grid';
import Header from './components/header';
import Footer from './components/footer';

/**
 * Supabase Grid.
 *
 * React component to render database table.
 */
export const SupabaseGrid = React.forwardRef<
  SupabaseGridRef,
  SupabaseGridProps
>((props, ref) => {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('supabase', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
          { token: 'string.sql', foreground: '24b47e' },
          { token: 'comment', foreground: '666666' },
          { token: 'predefined.sql', foreground: 'D4D4D4' },
        ],
        colors: {
          'editor.background': '#30313f',
        },
      });
    }
  }, [monaco]);

  return (
    <StoreProvider>
      <DndProvider backend={HTML5Backend}>
        <SupabaseGridLayout ref={ref} {...props} />
      </DndProvider>
    </StoreProvider>
  );
});

const SupabaseGridLayout = React.forwardRef<SupabaseGridRef, SupabaseGridProps>(
  (props, ref) => {
    const {
      editable,
      schema,
      storageRef,
      clientProps,
      gridProps,
      onEditRow,
    } = props;
    const dispatch = useDispatch();
    const state = useTrackedState();

    React.useImperativeHandle(ref, () => ({
      rowAdded(row: Dictionary<any>) {
        dispatch({
          type: 'ADD_NEW_ROW',
          payload: row,
        });
        console.log('rowAdded: ', row);
      },
      rowEdited(row: Dictionary<any>, idx: number) {
        dispatch({
          type: 'EDIT_ROW',
          payload: { row, idx },
        });
        console.log('rowEdited: ', row, 'at index: ', idx);
      },
    }));

    React.useEffect(() => {
      if (state.isInitialComplete && storageRef && state.table) {
        saveStorageDebounced(state, storageRef);
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
      if (!state.client) {
        dispatch({
          type: 'INIT_CLIENT',
          payload: { ...clientProps, schema },
        });
        dispatch({
          type: 'INIT_CALLBACK',
          payload: { ...props },
        });
      }
    }, [state.client]);

    React.useEffect(() => {
      if (!state.client) return;

      if (
        !state.table ||
        (typeof props.table == 'string' && state.table!.name != props.table) ||
        (typeof props.table != 'string' &&
          JSON.stringify(props.table) !== JSON.stringify(state.table))
      ) {
        initTable(props, state, dispatch);
      }
    }, [state.client, state.table, props.table]);

    return (
      <div className="supabase-grid flex flex-col h-full">
        <Header
          onAddRow={editable ? props.onAddRow : undefined}
          onAddColumn={editable ? props.onAddColumn : undefined}
        />
        <Grid {...gridProps} />
        <Footer />
        {createPortal(
          <RowMenu onEditRow={editable ? onEditRow : undefined} />,
          document.body
        )}
        {createPortal(<MultiRowsMenu />, document.body)}
      </div>
    );
  }
);

function initTable(
  props: SupabaseGridProps,
  state: InitialStateType,
  dispatch: (value: any) => void
) {
  function onLoadStorage(storageRef: string, tableName: string) {
    const key = getStorageKey(STORAGE_KEY_PREFIX, storageRef);
    const jsonStr = localStorage.getItem(key);
    if (!jsonStr) return;
    const json = JSON.parse(jsonStr);
    return json[tableName];
  }

  function onInitTable(tableDef: SupaTable, props: SupabaseGridProps) {
    const gridColumns = getGridColumns(tableDef, {
      defaultWidth: props.gridProps?.defaultColumnWidth,
      onEditRow: props.editable ? props.onEditRow : undefined,
    });

    let savedState;
    if (props.storageRef) {
      savedState = onLoadStorage(props.storageRef, tableDef.name);
      // console.log('savedState', savedState);
    }

    dispatch({
      type: 'INIT_TABLE',
      payload: {
        table: tableDef,
        gridProps: props.gridProps,
        gridColumns,
        savedState,
        editable: props.editable,
      },
    });
  }

  if (typeof props.table === 'string') {
    const fetchMethod = props.editable
      ? fetchTableInfo(state.tableService!, props.table, props.schema)
      : fetchReadonlyTableInfo(state.openApiService!, props.table);

    fetchMethod.then(res => {
      if (res) onInitTable(res, props);
      else {
        // TODO: handle error
      }
    });
  } else {
    onInitTable(props.table, props);
  }
}

function saveStorage(state: InitialStateType, storageRef: string) {
  if (!state.table) return;

  const config = {
    gridColumns: state.gridColumns,
    sorts: state.sorts,
    filters: state.filters,
  };
  const key = getStorageKey(STORAGE_KEY_PREFIX, storageRef);
  const savedStr = localStorage.getItem(key);

  let savedJson;
  if (savedStr) {
    savedJson = JSON.parse(savedStr);
    savedJson = { ...savedJson, [state.table.name]: config };
  } else {
    savedJson = { [state.table.name]: config };
  }
  localStorage.setItem(key, JSON.stringify(savedJson));
}
export const saveStorageDebounced = AwesomeDebouncePromise(saveStorage, 500);
