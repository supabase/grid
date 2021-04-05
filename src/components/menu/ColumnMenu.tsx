import * as React from 'react';
import { Menu, Item, ItemParams, PredicateParams } from 'react-contexify';
import { useDispatch, useTrackedState } from '../../store';

export const COLUMN_MENU_ID = 'column-menu-id';

type ColumnMenuProps = {
  onEditColumn?: (columnName: string) => void;
  onDeleteColumn?: (columnName: string) => void;
};

const ColumnMenu: React.FC<ColumnMenuProps> = ({
  onEditColumn,
  onDeleteColumn,
}) => {
  const state = useTrackedState();
  const dispatch = useDispatch();

  function onDeleteRow(p: ItemParams) {
    const { props } = p;
    const { columnName } = props;
    if (onDeleteColumn) onDeleteColumn(columnName);
  }

  function onFreezeColumn(p: ItemParams) {
    const { props } = p;
    const { columnKey } = props;
    dispatch({ type: 'FREEZE_COLUMN', payload: { columnKey } });
  }

  function onUnfreezeColumn(p: ItemParams) {
    const { props } = p;
    const { columnKey } = props;
    dispatch({ type: 'UNFREEZE_COLUMN', payload: { columnKey } });
  }

  function onEditColumnClick(p: ItemParams) {
    const { props } = p;
    const { columnName } = props;
    if (onEditColumn) onEditColumn(columnName);
  }

  function isItemHidden({ props, data }: PredicateParams) {
    if (data === 'edit') {
      return !state.editable || onEditColumnClick == undefined;
    } else if (data === 'freeze') {
      return props.frozen;
    } else {
      return !props.frozen;
    }
  }

  return (
    <Menu id={COLUMN_MENU_ID} animation={false}>
      <Item onClick={onEditColumnClick} hidden={isItemHidden} data="edit">
        Edit column
      </Item>
      <Item onClick={onFreezeColumn} hidden={isItemHidden} data="freeze">
        Freeze column
      </Item>
      <Item onClick={onUnfreezeColumn} hidden={isItemHidden} data="unfreeze">
        Unfreeze column
      </Item>
      <Item onClick={onDeleteRow}>Delete row</Item>
    </Menu>
  );
};
export default ColumnMenu;
