import * as React from 'react';
import { createPortal } from 'react-dom';
import RowService from '../services/RowService';
import DataGrid, {
  Row as GridRow,
  RowRendererProps,
  RowsChangeData,
} from 'react-data-grid';
import { TriggerEvent, useContextMenu } from 'react-contexify';
import { Dictionary, GridProps } from '../types';
import { Typography, Loading } from '@supabase/ui';
import { SupabaseGridCtx } from '../constants';
import { getGridColumns } from '../utils/column';
import RowMenu, { ROW_MENU_ID } from './menu/RowMenu';
import MultiRowsMenu, { MULTI_ROWS_MENU_ID } from './menu/MultiRowsMenu';

const Grid: React.FunctionComponent<GridProps> = ({
  width,
  height,
  defaultColumnWidth,
  containerClass,
  gridClass,
  rowClass,
}) => {
  const [rows, setRows] = React.useState<any[]>([]);
  const [columns, setColumns] = React.useState<any[]>([]);
  const [selectedRows, setSelectedRows] = React.useState(
    () => new Set<React.Key>()
  );
  const [ready, setReady] = React.useState(false);
  const ctx = React.useContext(SupabaseGridCtx);

  React.useEffect(() => {
    async function fetch() {
      const service = new RowService(ctx!.table!, ctx!.client);
      const res = await service.fetchAll();
      if (res.error) {
        // TODO: handle fetch rows data error
      }
      setRows(res.data || []);
      setReady(true);
    }

    if (ctx && !ready) {
      setColumns(
        getGridColumns(ctx.table!, { defaultWidth: defaultColumnWidth })
      );
      fetch();
    }
  }, [ctx]);

  function rowKeyGetter(row: Dictionary<any>) {
    return row.id;
  }

  function onRowsChange(
    rows: Dictionary<any>[],
    data: RowsChangeData<Dictionary<any>, unknown>
  ) {
    const rowData = rows[data.indexes[0]];
    const service = new RowService(ctx!.table!, ctx!.client);
    const { error } = service.update(rowData);
    if (error) {
      // TODO: show a toast error message
    } else {
      setRows(rows);
    }
  }

  function RowRenderer(props: RowRendererProps<Dictionary<any>>) {
    const isSelected = selectedRows.has(props.row.id);
    const menuId =
      isSelected && selectedRows.size > 1 ? MULTI_ROWS_MENU_ID : ROW_MENU_ID;
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

  if (!ctx || !ready)
    return (
      <div>
        <Loading active>
          <Typography.Text strong={true}>Loading ...</Typography.Text>
        </Loading>
      </div>
    );

  return (
    <div
      className={containerClass}
      style={{ width: width || '100%', height: height || '50vh' }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        rowRenderer={RowRenderer}
        onRowsChange={onRowsChange}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        className={gridClass}
        rowClass={rowClass}
        style={{ height: '100%' }}
      />
      {createPortal(<RowMenu rows={rows} setRows={setRows} />, document.body)}
      {createPortal(
        <MultiRowsMenu rows={rows} setRows={setRows} />,
        document.body
      )}
    </div>
  );
};
export default Grid;
