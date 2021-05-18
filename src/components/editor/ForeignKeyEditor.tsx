import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';
import {
  Button,
  Divider,
  Modal,
  Menu,
  Typography,
  IconExternalLink,
  IconX,
} from '@supabase/ui';
import { useTrackedState } from '../../store';
import { ModalPortal, NullValue } from '../common';
import { Dictionary } from '../../types';

export function ForeignKeyEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
}: EditorProps<TRow, TSummaryRow>) {
  const rawValue = row[column.key as keyof TRow] as unknown;
  const value = rawValue ? rawValue + '' : null;

  function onChange(_value: any | null) {
    if (!_value || _value == '')
      onRowChange({ ...row, [column.key]: null }, true);
    else onRowChange({ ...row, [column.key]: _value }, true);
  }

  function onClearValue() {
    onRowChange({ ...row, [column.key]: null }, true);
  }

  return (
    <div className="flex items-center px-2 overflow-hidden">
      <p className="m-0 flex-grow text-sm overflow-ellipsis">
        {value ? value : <NullValue />}
      </p>
      {value && (
        <Button
          type="text"
          onClick={onClearValue}
          icon={<IconX />}
          style={{ padding: '3px' }}
        />
      )}
      <ForeignTableModal columnName={column.key} onChange={onChange} />
    </div>
  );
}

type ForeignTableModalProps = {
  columnName: string | undefined;
  onChange: (value: any | null) => void;
};

export const ForeignTableModal: React.FC<ForeignTableModalProps> = ({
  columnName,
  onChange,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [rows, setRows] = React.useState<Dictionary<any>[] | null>(null);
  const state = useTrackedState();
  const columnDefinition = state.table?.columns.find(x => x.name == columnName);

  React.useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!state.client || !columnDefinition?.targetTableName) return;

    const res = await state.client
      .from(columnDefinition?.targetTableName)
      .select()
      .limit(10);

    if (!res.data || res.error) setRows(null);
    else setRows(res.data);
  }

  function toggle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (event && event.stopPropagation) event.stopPropagation();
    setVisible(!visible);
  }

  function onItemSelect(item: Dictionary<any>) {
    if (item && columnDefinition && columnDefinition.targetColumnName) {
      const value = item[columnDefinition.targetColumnName];
      onChange(value);
    }

    setVisible(false);
  }

  function renderRows() {
    if (!rows) return null;
    const temp = rows.map((x, i) => {
      const keys = Object.keys(x);
      return (
        <Menu.Item key={`menu-${i}`} onClick={() => onItemSelect(x)}>
          {keys.map((key, j) => {
            return <span key={`item-${j}`}>{`${key}:${x[key]}`}</span>;
          })}
        </Menu.Item>
      );
    });
    return <Menu>{temp}</Menu>;
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
          <Modal visible={visible} onCancel={toggle} closable hideFooter>
            <Typography.Text>This is the content of the Modal</Typography.Text>
            <Divider />
            <div className="overflow-scroll" style={{ maxHeight: '10rem' }}>
              {renderRows()}
            </div>
            <Divider />
          </Modal>
        </ModalPortal>
      )}
    </>
  );
};
