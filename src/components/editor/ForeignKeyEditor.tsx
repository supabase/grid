import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';
import { Button, Modal, Typography, IconExternalLink } from '@supabase/ui';
import { ModalPortal, NullValue } from '../common';

export function ForeignKeyEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
}: EditorProps<TRow, TSummaryRow>) {
  const rawValue = row[column.key as keyof TRow] as unknown;
  const value = rawValue ? rawValue + '' : undefined;

  return (
    <div
      className={`${
        !!value && value.trim().length == 0 ? 'fillContainer' : ''
      } flex items-center px-2 overflow-hidden`}
    >
      <p className="m-0 flex-grow text-sm overflow-ellipsis">
        {value ? value : <NullValue />}
      </p>
      <ForeignTableModal />
    </div>
  );
}

type ForeignTableModalProps = {};

export const ForeignTableModal: React.FC<ForeignTableModalProps> = ({}) => {
  const [visible, setVisible] = React.useState(false);

  function toggle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (event && event.stopPropagation) event.stopPropagation();
    setVisible(!visible);
  }

  return (
    <>
      <Button
        type="text"
        onClick={toggle}
        icon={<IconExternalLink />}
        style={{ padding: '3px' }}
      />
      {visible && (
        <ModalPortal>
          <Modal visible={visible} onCancel={toggle} onConfirm={toggle}>
            <Typography.Text>This is the content of the Modal</Typography.Text>
          </Modal>
        </ModalPortal>
      )}
    </>
  );
};
