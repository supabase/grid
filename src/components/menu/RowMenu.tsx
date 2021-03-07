import * as React from 'react';
import 'react-contexify/dist/ReactContexify.css';
import { Menu, Item, ItemParams } from 'react-contexify';
import { Dictionary } from '../../types';
import { SupabaseGridCtx } from '../../constants';
import RowService from '../../services/RowService';

export const ROW_MENU_ID = 'row-menu-id';

type RowMenuProps = {
  rows: Dictionary<any>[];
  setRows: (rows: Dictionary<any>[]) => void;
};

const RowMenu: React.FunctionComponent<RowMenuProps> = ({ rows, setRows }) => {
  const ctx = React.useContext(SupabaseGridCtx);

  function onRowDelete(p: ItemParams) {
    const { props } = p;
    const { rowIdx, rowId } = props;
    const service = new RowService(ctx!.table!, ctx!.client);
    service.delete([rowId]);
    setRows([...rows.slice(0, rowIdx), ...rows.slice(rowIdx + 1)]);
  }

  return (
    <Menu id={ROW_MENU_ID}>
      <Item onClick={onRowDelete}>Delete row</Item>
    </Menu>
  );
};
export default RowMenu;
