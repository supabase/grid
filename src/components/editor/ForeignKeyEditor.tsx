import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';
import { Button, IconExternalLink } from '@supabase/ui';
import { NullValue } from '../common';

export function ForeignKeyEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
}: EditorProps<TRow, TSummaryRow>) {
  const rawValue = row[column.key as keyof TRow] as unknown;
  const value = rawValue ? rawValue + '' : undefined;

  function onExternalLinkClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    // show foreign table modal, user can select the row to link
    alert('Show foreign table modal');
  }

  return (
    <div
      className={`${
        !!value && value.trim().length == 0 ? 'fillContainer' : ''
      } flex items-center px-2 overflow-hidden`}
    >
      <p className="m-0 flex-grow text-sm overflow-ellipsis">
        {value ? value : <NullValue />}
      </p>
      <Button
        type="text"
        onClick={onExternalLinkClick}
        icon={<IconExternalLink />}
        style={{ padding: '3px' }}
      />
    </div>
  );
}
