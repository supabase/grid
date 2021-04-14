import './style.css';
import * as React from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
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
import { ColumnMenu, RowMenu, MultiRowsMenu } from './components/menu';
import { InitialStateType } from './store/reducers';
import { getGridColumns } from './GridColumns';
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
  console.log('SupabaseGrid ref v1.2323232', ref);
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
      schema,
      storageRef,
      clientProps,
      gridProps,
      onEditRow,
      onEditColumn,
      onDeleteColumn,
    } = props;
    const dispatch = useDispatch();
    const state = useTrackedState();

    console.log('SupabaseGridLayout ref', ref);

    React.useImperativeHandle(ref, () => ({
      rowAdded(row: Dictionary<any>) {
        console.log('rowAdded: ', row);
      },
      rowEdited(row: Dictionary<any>) {
        console.log('rowEdited: ', row);
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
      <div className="flex flex-col h-full">
        <Header onAddRow={props.onAddRow} onAddColumn={props.onAddColumn} />
        <Grid {...gridProps} />
        <Footer />
        {createPortal(
          <ColumnMenu
            onEditColumn={onEditColumn}
            onDeleteColumn={onDeleteColumn}
          />,
          document.body
        )}
        {createPortal(<RowMenu onEditRow={onEditRow} />, document.body)}
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
      onEditRow: props.onEditRow,
    });

    let savedState;
    if (props.storageRef)
      savedState = onLoadStorage(props.storageRef, tableDef.name);
    console.log('savedState', savedState);

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
