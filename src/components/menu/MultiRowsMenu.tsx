import * as React from 'react';
import {
  Menu,
  Item,
  ItemParams,
  theme,
  PredicateParams,
} from 'react-contexify';
import { useDispatch, useTrackedState } from '../../store';
import { exportRowsToCsv } from '../../utils';
import FileSaver from 'file-saver';

export const MULTI_ROWS_MENU_ID = 'multi-rows-menu-id';

type MultiRowsMenuProps = {};

const MultiRowsMenu: React.FC<MultiRowsMenuProps> = () => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  function onRowsDelete(p: ItemParams) {
    const { props } = p;
    const { selectedRows } = props;
    const rowIdxs = Array.from(selectedRows) as number[];
    const rows = state.rows.filter(x => rowIdxs.includes(x.idx));
    state.rowService!.delete(rows);
    dispatch({ type: 'REMOVE_ROWS', payload: { rowIdxs } });
  }

  function onRowsExportCsv(p: ItemParams) {
    const { props } = p;
    const { selectedRows } = props;
    const rows = state.rows.filter(x => selectedRows.has(x.idx));
    const csv = exportRowsToCsv(state.table!.columns, rows);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvData, `${state.table!.name}_rows.csv`);
  }

  function onAllRowsExportCsv() {
    const csv = exportRowsToCsv(state.table!.columns, state.rows);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvData, `${state.table!.name}_allRows.csv`);
  }

  function isItemHidden({ props, data }: PredicateParams) {
    if (data === 'export_all_to_csv') return !props.allRowsSelected;
    if (data === 'export_rows_to_csv') return !props.selectedRows;
    if (data === 'delete_rows') return !props.selectedRows;
    return false;
  }

  return (
    <Menu id={MULTI_ROWS_MENU_ID} animation={false} theme={theme.dark}>
      <Item
        onClick={onAllRowsExportCsv}
        hidden={isItemHidden}
        data="export_all_to_csv"
      >
        Export all rows to csv
      </Item>
      <Item
        onClick={onRowsExportCsv}
        hidden={isItemHidden}
        data="export_rows_to_csv"
      >
        Export rows to csv
      </Item>
      <Item onClick={onRowsDelete} hidden={isItemHidden} data="delete_rows">
        Delete rows
      </Item>
    </Menu>
  );
};
export default MultiRowsMenu;
