import * as React from 'react';
import { createPortal } from 'react-dom';
import DataGrid, {
  Row as GridRow,
  RowRendererProps,
  RowsChangeData,
} from 'react-data-grid';
import { Typography, Loading } from '@supabase/ui';
import { TriggerEvent, useContextMenu } from 'react-contexify';
import { Dictionary, GridProps } from '../types';
import { RowMenu, MultiRowsMenu, MENU_IDS } from './menu';
import { useDispatch, useTrackedState } from '../store';
import { fetchPage, refreshPageDebounced } from '../utils';

const Grid: React.FC<GridProps> = ({
  width,
  height,
  containerClass,
  gridClass,
  rowClass,
}) => {
  const dispatch = useDispatch();
  const state = useTrackedState();
  const [selectedRows, setSelectedRows] = React.useState(
    () => new Set<React.Key>()
  );
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (state.shouldRefreshPage) {
      refreshPageDebounced(state, dispatch);
    }
  }, [state, dispatch]);

  React.useEffect(() => {
    if (state.table && !ready) {
      fetchPage(state, dispatch).then(() => setReady(true));
    }
  }, [state, dispatch]);

  function rowKeyGetter(row: Dictionary<any>) {
    return row.id;
  }

  function onRowsChange(
    rows: Dictionary<any>[],
    data: RowsChangeData<Dictionary<any>, unknown>
  ) {
    const rowData = rows[data.indexes[0]];
    const { error } = state.rowService!.update(rowData);
    if (error) {
      // TODO: show a toast error message
    } else {
      dispatch({ type: 'SET_ROWS', payload: rows });
    }
  }

  function RowRenderer(props: RowRendererProps<Dictionary<any>>) {
    const isSelected = selectedRows.has(props.row.id);
    const menuId =
      isSelected && selectedRows.size > 1
        ? MENU_IDS.MULTI_ROWS_MENU_ID
        : MENU_IDS.ROW_MENU_ID;
    const { show } = useContextMenu({
      id: menuId,
    });

    function displayMenu(e: TriggerEvent) {
      if (!isSelected) setSelectedRows(new Set<React.Key>());
      show(e, {
        props: { rowId: props.row.id, rowIdx: props.rowIdx, selectedRows },
      });
    }

    return <GridRow {...props} onContextMenu={displayMenu} />;
  }

  if (!ready)
    return (
      <div
        className="flex justify-center bg-gray-900"
        style={{ width: width || '100%', height: height || '50vh' }}
      >
        <div className="flex items-center">
          <Loading active>
            <div />
          </Loading>
          <Typography.Text className="m-8">loading ...</Typography.Text>
        </div>
      </div>
    );

  return (
    <div
      className={containerClass}
      style={{ width: width || '100%', height: height || '50vh' }}
    >
      <DataGrid
        columns={state.gridColumns}
        rows={state.rows}
        rowRenderer={RowRenderer}
        onRowsChange={onRowsChange}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        className={gridClass}
        rowClass={rowClass}
        style={{ height: '100%' }}
      />
      {createPortal(<RowMenu />, document.body)}
      {createPortal(<MultiRowsMenu />, document.body)}
    </div>
  );
};
export default Grid;
