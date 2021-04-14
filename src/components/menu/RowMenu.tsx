import * as React from 'react';
import {
  Menu,
  Item,
  ItemParams,
  PredicateParams,
  theme,
} from 'react-contexify';
import { useDispatch, useTrackedState } from '../../store';
import { Dictionary } from '../../types';

export const ROW_MENU_ID = 'row-menu-id';

type RowMenuProps = {
  onEditRow?: (row: Dictionary<any>) => void;
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
    const row = state.rows[rowIdx];
    // remove idx from row data
    const { idx, ...rawRowData } = row;
    if (onEditRow) onEditRow(rawRowData);
  }

  function isItemHidden({ data }: PredicateParams) {
    if (data === 'edit') return onEditRowClick == undefined;
    return false;
  }

  return (
    <Menu id={ROW_MENU_ID} animation={false} theme={theme.dark}>
      <Item onClick={onEditRowClick} hidden={isItemHidden} data="edit">
        Edit row
      </Item>
      <Item onClick={onDeleteRow}>Delete row</Item>
    </Menu>
  );
};
export default RowMenu;
