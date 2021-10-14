import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useDrop, DropTargetMonitor } from 'react-dnd';

interface StorageMediaEditorProps<TRow, TSummaryRow = unknown>
  extends EditorProps<TRow, TSummaryRow> {
  options: { bucketName: string; mediaUrlPrefix: string };
  storage: any;
}

export function StorageMediaEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  options,
  storage,
}: StorageMediaEditorProps<TRow, TSummaryRow>) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(item: { files: any[] }) {
      const file = item.files[0];
      console.log('file', item);
      const { data, error } = storage
        .from(options.bucketName)
        .upload(file.name, file);
      onRowChange({ ...row, [column.key]: file.name });
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let overlayDivClass = 'sb-grid-storage-media-editor-overlay';
  if (isActive)
    overlayDivClass += ' sb-grid-storage-media-editor-overlay__trigger';
  return (
    <div className="sb-grid-storage-media-editor">
      <div className={overlayDivClass} ref={drop}></div>
      <img src={options.mediaUrlPrefix + row[column.key]} />
    </div>
  );
}
