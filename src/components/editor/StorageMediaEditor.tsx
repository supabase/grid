import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';
import { NativeTypes } from 'react-dnd-html5-backend';
import { IconDownload } from '@supabase/ui';
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
  async function upload(file: any) {
    console.log('file', file);
    const { error } = await storage
      .from(options.bucketName)
      .upload(file.name, file);
    if (error) {
      // TODO:
    } else {
      onRowChange({ ...row, [column.key]: file.name });
    }
  }

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    async drop(item: { files: any[] }) {
      const file = item.files[0];
      console.log('file', item);
      upload(file);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  const val = row[column.key];
  const isNull = val === null;
  let overlayDivClass = 'sb-grid-storage-media-editor-overlay';
  if (isActive)
    overlayDivClass += ' sb-grid-storage-media-editor-overlay__trigger';
  return (
    <div className="sb-grid-storage-media-editor">
      {isNull ? (
        <IconDownload className="sb-grid-storage-media-upload-icon"></IconDownload>
      ) : (
        <img src={options.mediaUrlPrefix + val} />
      )}
      <div className={overlayDivClass} ref={drop}></div>
      <input type="file" onChange={(evt) => upload(evt.target.files![0])} />
    </div>
  );
}
