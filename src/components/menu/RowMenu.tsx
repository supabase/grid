import * as React from 'react';
import 'react-contexify/dist/ReactContexify.css';
import { Menu, Item, ItemParams, PredicateParams } from 'react-contexify';
import { useDispatch, useTrackedState } from '../../store';

export const ROW_MENU_ID = 'row-menu-id';

type RowMenuProps = {
  onEditRow?: (rowIdx: number) => void;
};

const RowMenu: React.FC<RowMenuProps> = ({ onEditRow }) => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  function onDeleteRow(p: ItemParams) {
    const { props } = p;
    const { rowIdx } = props;
    const row = state.rows[rowIdx];
    state.rowService!.delete([row]);
    dispatch({ type: 'REMOVE_ROWS', payload: { rowIdxs: [rowIdx] } });
  }

  function onEditRowClick(p: ItemParams) {
    const { props } = p;
    const { rowIdx } = props;
    if (onEditRow) onEditRow(rowIdx);
  }

  function isItemHidden({ data }: PredicateParams) {
    if (data === 'edit') return onEditRowClick == undefined;
    return false;
  }

  return (
    <Menu id={ROW_MENU_ID} animation={false}>
      <Item onClick={onEditRowClick} hidden={isItemHidden} data="edit">
        Edit row
      </Item>
      <Item onClick={onDeleteRow}>Delete row</Item>
    </Menu>
  );
};
export default RowMenu;
