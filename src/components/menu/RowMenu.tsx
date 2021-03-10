import * as React from 'react';
import 'react-contexify/dist/ReactContexify.css';
import { Menu, Item, ItemParams } from 'react-contexify';
import { useDispatch, useTrackedState } from '../../store';

export const ROW_MENU_ID = 'row-menu-id';

type RowMenuProps = {};

const RowMenu: React.FC<RowMenuProps> = () => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  function onRowDelete(p: ItemParams) {
    const { props } = p;
    const { rowId } = props;
    state.rowService!.delete([rowId]);
    dispatch({ type: 'REMOVE_ROWS', payload: [rowId] });
  }

  return (
    <Menu id={ROW_MENU_ID}>
      <Item onClick={onRowDelete}>Delete row</Item>
    </Menu>
  );
};
export default RowMenu;
