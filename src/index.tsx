import * as React from 'react';
import DataEditor, {
  DataEditorContainer,
  EditableGridCell,
  GridCell,
  GridColumn,
} from '@glideapps/glide-data-grid';

type Props = {
  columns: GridColumn[];
  getCellContent: (cell: readonly [number, number]) => GridCell;
  onCellEdited?: (
    cell: readonly [number, number],
    newValue: EditableGridCell
  ) => void;
};

const SupabaseGrid = ({ columns, getCellContent, onCellEdited }: Props) => {
  return (
    <>
      <DataEditorContainer width={500} height={300}>
        <DataEditor
          columns={columns}
          rows={10}
          getCellContent={getCellContent}
          onCellEdited={onCellEdited}
        />
      </DataEditorContainer>
      <div id="portal" />
    </>
  );
};
export default SupabaseGrid;
