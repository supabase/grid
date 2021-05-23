import * as React from 'react';
import { memo } from 'react-tracked';
import DataGrid, { RowsChangeData } from '@supabase/react-data-grid';
import { Typography, Loading } from '@supabase/ui';
import { GridProps, SupaRow } from '../../types';
import { useDispatch, useTrackedState } from '../../store';

export const Grid: React.FC<GridProps> = memo(
  ({ width, height, containerClass, gridClass, rowClass }) => {
    const dispatch = useDispatch();
    const state = useTrackedState();
    // workaround to force state tracking on state.gridColumns
    const columnHeaders = state.gridColumns.map(x => `${x.key}_${x.frozen}`);
    const { onError: onErrorFunc } = state;

    function rowKeyGetter(row: SupaRow) {
      return row.idx;
    }

    function onColumnResized(index: number, width: number) {
      // selectColumn is considered as the first col
      const _index = index - 1;
      dispatch({
        type: 'UPDATE_COLUMN_SIZE',
        payload: { index: _index, width: Math.round(width) },
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

    function onSelectedRowsChange(selectedRows: Set<React.Key>) {
      dispatch({
        type: 'SELECTED_ROWS_CHANGE',
        payload: { selectedRows },
      });
    }

    if (!columnHeaders || columnHeaders.length == 0) {
      return (
        <div
          className="flex justify-center bg-gray-100 dark:bg-gray-900"
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
    }
    return (
      <div
        className={containerClass}
        style={{ width: width || '100%', height: height || '50vh' }}
      >
        <DataGrid
          columns={state.gridColumns}
          rows={state.rows}
          rowKeyGetter={rowKeyGetter}
          selectedRows={state.selectedRows}
          onColumnResized={onColumnResized}
          onRowsChange={onRowsChange}
          onSelectedRowsChange={onSelectedRowsChange}
          className={gridClass}
          rowClass={rowClass}
          style={{ height: '100%' }}
        />
      </div>
    );
  }
);
