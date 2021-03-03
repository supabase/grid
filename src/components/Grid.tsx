import * as React from 'react';
import DataEditor, {
  DataEditorContainer,
  EditableGridCell,
  GridCell,
  GridCellKind,
} from '@glideapps/glide-data-grid';
import { SupabaseGridCtx } from '../SupabaseGrid';
import { getGridColumns } from '../utils/table';

export type GridProps = {
  width?: number;
  height?: number;
};

const Grid: React.FunctionComponent<GridProps> = p => {
  const { width, height } = p;
  const ctx = React.useContext(SupabaseGridCtx);
  if (!ctx) throw new Error('SupabaseGrid context is undefined');
  const columns = getGridColumns(ctx.table, { defaultWidth: 150 });

  function getCellContent([col, row]: readonly [number, number]): GridCell {
    let n: number;
    if (col === 0) {
      n = row;
    } else if (col === 1) {
      n = row * row;
    } else if (col === 2) {
      const value = !(row % 2) ? false : true;
      return {
        kind: GridCellKind.Boolean,
        data: value,
        showUnchecked: true,
        allowOverlay: true,
        allowEdit: true,
      };
    } else {
      throw new Error('This should not happen');
    }
    return {
      kind: GridCellKind.Text,
      data: n + '',
      displayData: n.toString(),
      allowOverlay: true,
    };
  }

  function onCellEdited(
    cell: readonly [number, number],
    newValue: EditableGridCell
  ) {
    console.log('cell', cell, 'newValue', newValue);
  }

  return (
    <>
      <DataEditorContainer width={width || 500} height={height || 300}>
        <DataEditor
          columns={columns}
          rows={0}
          getCellContent={getCellContent}
          onCellEdited={onCellEdited}
        />
      </DataEditorContainer>
      <div id="portal" />
    </>
  );
};
export default Grid;
