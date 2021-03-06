import * as React from 'react';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { Dictionary } from '../../types';

export const MULTI_ROWS_MENU_ID = 'multi-rows-menu-id';

type MultiRowsMenuProps = {
  rows: Dictionary<any>[];
  setRows: (rows: Dictionary<any>[]) => void;
};

const MultiRowsMenu: React.FunctionComponent<MultiRowsMenuProps> = ({
  rows,
  setRows,
}) => {
  function onRowsDelete(p: ItemParams) {
    const { props } = p;
    const _rows = rows.filter(x => !props.selectedRows.has(x.id));
    setRows(_rows);
  }

  return (
    <Menu id={MULTI_ROWS_MENU_ID}>
      <Item onClick={onRowsDelete}>Delete all selected rows</Item>
    </Menu>
  );
};
export default MultiRowsMenu;
