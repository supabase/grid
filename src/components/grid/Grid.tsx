import * as React from 'react';
import { memo } from 'react-tracked';
import DataGrid, {
  DataGridHandle,
  RowsChangeData,
} from '@supabase/react-data-grid';
import { Typography, Loading } from '@supabase/ui';
import { GridProps, SupaRow } from '../../types';
import { useDispatch, useTrackedState } from '../../store';
import RowRenderer from './RowRenderer';

function rowKeyGetter(row: SupaRow) {
  return row.idx;
}

export const Grid = memo(
  React.forwardRef<DataGridHandle, GridProps>(
    (
      { width, height, containerClass, gridClass, rowClass },
      ref: React.Ref<DataGridHandle> | undefined
    ) => {
      const dispatch = useDispatch();
      const state = useTrackedState();
      // workaround to force state tracking on state.gridColumns
      const columnHeaders = state.gridColumns.map(x => `${x.key}_${x.frozen}`);
      const { gridColumns, rows, onError: onErrorFunc } = state;

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
        const originRowData = state.rows.find(x => x.idx == rowData.idx);
        const hasChange =
          JSON.stringify(rowData) !== JSON.stringify(originRowData);
        if (hasChange) {
          const { error } = state.rowService!.update(rowData);
          if (error) {
            if (onErrorFunc) onErrorFunc(error);
          } else {
            dispatch({
              type: 'SET_ROWS',
              payload: { rows, totalRows: state.totalRows },
            });
          }
        }
      }

      function onSelectedRowsChange(selectedRows: ReadonlySet<number>) {
        dispatch({
          type: 'SELECTED_ROWS_CHANGE',
          payload: { selectedRows },
        });
      }

      function onSelectedCellChange(position: { idx: number; rowIdx: number }) {
        dispatch({
          type: 'SELECTED_CELL_CHANGE',
          payload: { position },
        });
      }

      if (!columnHeaders || columnHeaders.length == 0) {
        return (
          <div
            className="sb-grid-grid--loading"
            style={{ width: width || '100%', height: height || '50vh' }}
          >
            <div className="sb-grid-grid--loading__inner">
              <Loading active>
                <div />
              </Loading>
              <Typography.Text className="sb-grid-grid--loading__inner__text">
                loading ...
              </Typography.Text>
            </div>
          </div>
        );
      }
      return (
        <div
          className={containerClass}
          style={{ width: width || '100%', height: height || '50vh' }}
        >
          <DataGrid
            ref={ref}
            columns={gridColumns}
            rows={rows ?? []}
            rowRenderer={RowRenderer}
            rowKeyGetter={rowKeyGetter}
            selectedRows={state.selectedRows}
            onColumnResized={onColumnResized}
            onRowsChange={onRowsChange}
            onSelectedCellChange={onSelectedCellChange}
            onSelectedRowsChange={onSelectedRowsChange}
            className={gridClass}
            rowClass={rowClass}
            style={{ height: '100%' }}
          />
        </div>
      );
    }
  )
);
