import * as React from 'react';
import { Menu, Item, ItemParams, PredicateParams } from 'react-contexify';
import { useDispatch, useTrackedState } from '../../store';

export const ROW_CONTEXT_MENU_ID = 'row-context-menu-id';

type RowContextMenuProps = {};

const RowContextMenu: React.FC<RowContextMenuProps> = ({}) => {
  const state = useTrackedState();
  const dispatch = useDispatch();

  function onDeleteRow(p: ItemParams) {
    const { props } = p;
    const { rowIdx } = props;
    const row = state.rows[rowIdx];
    const { error } = state.rowService!.delete([row]);
    if (error) {
      if (state.onError) state.onError(error);
    } else {
      dispatch({ type: 'REMOVE_ROWS', payload: { rowIdxs: [row.idx] } });
    }
  }

  function onEditRowClick(p: ItemParams) {
    const { props } = p;
    const { rowIdx } = props;
    const row = state.rows[rowIdx];
    if (state.onEditRow) state.onEditRow(row);
  }

  function isItemHidden({ data }: PredicateParams) {
    if (data === 'edit') return onEditRowClick == undefined;
    return false;
  }

  return (
    <>
      <Menu id={ROW_CONTEXT_MENU_ID} animation={false}>
        <Item onClick={onEditRowClick} hidden={isItemHidden} data="edit">
          Edit row
        </Item>
        <Item onClick={onDeleteRow}>Delete row</Item>
      </Menu>
    </>
  );
};
export default RowContextMenu;
