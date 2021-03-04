import * as React from 'react';
import { getGridColumns } from '../utils/column';
import RowService from '../services/RowService';
import { SupabaseGridCtx } from '../context';
import DataGrid, { FillEvent, RowsChangeData } from 'react-data-grid';
import { Dictionary } from '../types';
import { updateCell } from '../utils/cell';
import { Typography, Loading } from '@supabase/ui';

export type GridProps = {
  width?: number;
  height?: number;
};

const Grid: React.FunctionComponent<GridProps> = () => {
  const [rows, setRows] = React.useState<any[]>([]);
  const [columns, setColumns] = React.useState<any[]>([]);
  const [selectedRows, setSelectedRows] = React.useState(
    () => new Set<React.Key>()
  );
  const [ready, setReady] = React.useState(false);
  const ctx = React.useContext(SupabaseGridCtx);

  React.useEffect(() => {
    async function fetch() {
      const service = new RowService(ctx!.client);
      const res = await service.fetchAll(ctx!.table!.name);
      setRows(res.data || []);
      setReady(true);
    }

    if (ctx && !ready) {
      setColumns(getGridColumns(ctx.table!, { defaultWidth: 150 }));
      fetch();
    }
  }, [ctx]);

  function rowKeyGetter(row: Dictionary<any>) {
    return row.id;
  }

  async function onRowsChange(
    rows: Dictionary<any>[],
    data: RowsChangeData<Dictionary<any>, unknown>
  ) {
    const rowData = rows[data.indexes[0]];
    const service = new RowService(ctx!.client);
    const result = await updateCell(ctx!.table!, rowData, service);
    if (result) {
      setRows(rows);
    }
  }

  function handleFill({
    columnKey,
    sourceRow,
    targetRows,
  }: FillEvent<Dictionary<any>>): Dictionary<any>[] {
    return targetRows.map(row => ({
      ...row,
      [columnKey]: sourceRow[columnKey],
    }));
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
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        onFill={handleFill}
        onRowsChange={onRowsChange}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
    </>
  );
};
export default Grid;
