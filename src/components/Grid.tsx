import * as React from 'react';
import DataEditor, {
  DataEditorContainer,
  EditableGridCell,
  GridCell,
  GridColumn,
} from '@glideapps/glide-data-grid';
import { getGridColumns } from '../utils/column';
import RowService from '../services/RowService';
import { getCellContent } from '../utils/cell';
import { SupabaseGridCtx } from '../context';

export type GridProps = {
  width?: number;
  height?: number;
};

const Grid: React.FunctionComponent<GridProps> = ({ width, height }) => {
  const [rows, setRows] = React.useState<any[]>([]);
  const [columns, setColumns] = React.useState<GridColumn[]>([]);
  const [ready, setReady] = React.useState(false);
  const ctx = React.useContext(SupabaseGridCtx);

  React.useEffect(() => {
    async function fetch() {
      const service = new RowService(ctx!.client);
      const res = await service.fetchAll(ctx!.table!.name);
      console.log('res.data', res.data);
      setRows(res.data || []);
      setReady(true);
    }

    if (ctx && !ready) {
      setColumns(getGridColumns(ctx.table!, { defaultWidth: 150 }));
      fetch();
    }
  }, [ctx]);

  function cellContentHandle([col, row]: readonly [number, number]): GridCell {
    const rowData = rows[row];
    return getCellContent(ctx!.table!, col, rowData);
  }

  function cellEditedHandle(
    cell: readonly [number, number],
    newValue: EditableGridCell
  ) {
    console.log('cell', cell, 'newValue', newValue);
  }

  function columnResizeHandle(column: GridColumn, newSize: number) {
    const foundIndex = columns.findIndex(x => x.title == column.title);
    if (foundIndex >= 0) {
      const cloneColumns = columns.slice(0);
      let newCol = { ...column, width: newSize };
      cloneColumns[foundIndex] = newCol;
      setColumns(cloneColumns);
    }
  }

  if (!ctx) return null;

  return (
    <>
      <DataEditorContainer width={width || 500} height={height || 300}>
        {ready && (
          <DataEditor
            columns={columns}
            rows={rows?.length || 0}
            getCellContent={cellContentHandle}
            onCellEdited={cellEditedHandle}
            onColumnResized={columnResizeHandle}
            allowResize={true}
          />
        )}
      </DataEditorContainer>
      <div id="portal" />
    </>
  );
};
export default Grid;
