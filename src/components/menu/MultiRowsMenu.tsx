import * as React from 'react';
import 'react-contexify/dist/ReactContexify.css';
import { Menu, Item, ItemParams } from 'react-contexify';
import { SupabaseGridCtx } from '../../constants';
import { Dictionary } from '../../types';
import RowService from '../../services/RowService';

export const MULTI_ROWS_MENU_ID = 'multi-rows-menu-id';

type MultiRowsMenuProps = {
  rows: Dictionary<any>[];
  setRows: (rows: Dictionary<any>[]) => void;
};

const MultiRowsMenu: React.FunctionComponent<MultiRowsMenuProps> = ({
  rows,
  setRows,
}) => {
  const ctx = React.useContext(SupabaseGridCtx);

  function onRowsDelete(p: ItemParams) {
    const { props } = p;
    const { selectedRows } = props;
    const service = new RowService(ctx!.table!, ctx!.client);
    const removeIds = Array.from(selectedRows) as number[] | string[];
    service.delete(removeIds);

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
