import * as React from 'react';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { Dictionary } from '../types';

export const ROW_CONTEXT_MENU_ID = 'row-menu-id';

type RowContextMenuProps = {
  rows: Dictionary<any>[];
  setRows: (rows: Dictionary<any>[]) => void;
};

const RowContextMenu: React.FunctionComponent<RowContextMenuProps> = ({
  rows,
  setRows,
}) => {
  function onRowDuplicate(p: ItemParams) {
    const { event, props, triggerEvent, data } = p;
    console.log(event, props, triggerEvent, data);
  }

  function onRowDelete(p: ItemParams) {
    const { props } = p;
    setRows([...rows.slice(0, props.rowIdx), ...rows.slice(props.rowIdx + 1)]);
  }

  return (
    <Menu id={ROW_CONTEXT_MENU_ID}>
      <Item onClick={onRowDuplicate}>Duplicate row</Item>
      <Item onClick={onRowDelete}>Delete row</Item>
    </Menu>
  );
};
export default RowContextMenu;
