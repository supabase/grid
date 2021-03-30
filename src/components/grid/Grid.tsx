import * as React from 'react';
import { memo } from 'react-tracked';
import DataGrid, {
  Row as GridRow,
  RowRendererProps,
  RowsChangeData,
} from '@phamhieu1998/react-data-grid';
import { Typography, Loading } from '@supabase/ui';
import { TriggerEvent, useContextMenu } from 'react-contexify';
import { GridProps, SupaRow } from '../../types';
import { MENU_IDS } from '../menu';
import { useDispatch, useTrackedState } from '../../store';

export const Grid: React.FC<GridProps> = memo(
  ({ width, height, containerClass, gridClass, rowClass }) => {
    const dispatch = useDispatch();
    const state = useTrackedState();
    // workaround to force state tracking on state.gridColumns
    const columnHeaders = state.gridColumns.map(x => `${x.key}_${x.frozen}`);
    const [selectedRows, setSelectedRows] = React.useState(
      () => new Set<React.Key>()
    );
    const { show: showContextMenu } = useContextMenu();

    function rowKeyGetter(row: SupaRow) {
      return row.idx;
    }

    function onColumnResized(index: number, width: number) {
      dispatch({
        type: 'UPDATE_COLUMN_SIZE',
        payload: { index, width: Math.round(width) },
      });
    }

    function onRowsChange(
      rows: SupaRow[],
      data: RowsChangeData<SupaRow, unknown>
    ) {
      const rowData = rows[data.indexes[0]];
      const { error } = state.rowService!.update(rowData);
      if (error) {
        // TODO: show a toast error message
      } else {
        dispatch({
          type: 'SET_ROWS',
          payload: { rows, totalRows: state.totalRows },
        });
      }
    }

    function RowRenderer(props: RowRendererProps<SupaRow>) {
      const isSelected = selectedRows.has(props.row.idx);

      function displayMenu(e: TriggerEvent) {
        if (!isSelected) setSelectedRows(new Set<React.Key>());
        const menuId =
          isSelected && selectedRows.size > 1
            ? MENU_IDS.MULTI_ROWS_MENU_ID
            : MENU_IDS.ROW_MENU_ID;
        showContextMenu(e, {
          id: menuId,
          props: { rowIdx: props.rowIdx, selectedRows },
        });
      }

      return (
        <GridRow
          {...props}
          onContextMenu={state.editable ? displayMenu : undefined}
        />
      );
    }

    if (!columnHeaders || columnHeaders.length == 0)
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
          rowKeyGetter={rowKeyGetter}
          selectedRows={selectedRows}
          onColumnResized={onColumnResized}
          onRowsChange={onRowsChange}
          onSelectedRowsChange={setSelectedRows}
          className={gridClass}
          rowClass={rowClass}
          style={{ height: '100%' }}
        />
      </div>
    );
  }
);
