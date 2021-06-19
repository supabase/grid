import {
  Button,
  Dropdown,
  IconChevronDown,
  Divider,
  IconEdit,
  IconTrash,
} from '@supabase/ui';
import * as React from 'react';
import { useDispatch, useTrackedState } from '../../store';
import { exportRowsToCsv } from '../../utils';
import FileSaver from 'file-saver';

type RowMenuProps = {};

const RowMenu: React.FC<RowMenuProps> = ({}) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const { selectedRows, rows: allRows } = state;

  function onRowsDelete() {
    const rowIdxs = Array.from(selectedRows) as number[];
    const rows = allRows.filter(x => rowIdxs.includes(x.idx));
    const { error } = state.rowService!.delete(rows);
    if (error) {
      if (state.onError) state.onError(error);
    } else {
      dispatch({ type: 'REMOVE_ROWS', payload: { rowIdxs } });
      dispatch({
        type: 'SELECTED_ROWS_CHANGE',
        payload: { selectedRows: new Set<React.Key>() },
      });
    }
  }

  function onRowsExportCsv() {
    const rows = allRows.filter(x => selectedRows.has(x.idx));
    const csv = exportRowsToCsv(state.table!.columns, rows);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvData, `${state.table!.name}_rows.csv`);
  }

  function onAllRowsExportCsv() {
    const csv = exportRowsToCsv(state.table!.columns, allRows);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvData, `${state.table!.name}_allRows.csv`);
  }

  function renderMenu() {
    return (
      <>
        {state.selectedRows.size == 0 && (
          <Dropdown.Item
            onClick={onAllRowsExportCsv}
            icon={<IconEdit size="tiny" />}
          >
            Export all rows to csv
          </Dropdown.Item>
        )}

        {state.selectedRows.size > 0 && (
          <Dropdown.Item
            onClick={onRowsExportCsv}
            icon={<IconEdit size="tiny" />}
          >
            Export selected rows to Csv
          </Dropdown.Item>
        )}

        {state.editable && state.selectedRows.size > 0 && (
          <>
            <Divider light />
            <Dropdown.Item
              onClick={onRowsDelete}
              icon={<IconTrash size="tiny" />}
            >
              Delete selected rows
            </Dropdown.Item>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <Dropdown align="end" side="bottom" overlay={renderMenu()}>
        <Button
          as={'span'}
          type="text"
          icon={<IconChevronDown />}
          style={{ padding: '3px' }}
        />
      </Dropdown>
    </>
  );
};
export default RowMenu;
