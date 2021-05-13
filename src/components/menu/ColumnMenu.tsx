import * as React from 'react';
import {
  Menu,
  Item,
  ItemParams,
  PredicateParams,
  theme,
} from 'react-contexify';
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
    const { columnKey } = props;
    if (onEditColumn) onEditColumn(columnKey);
  }

  function onDeleteColumnClick(p: ItemParams) {
    const { props } = p;
    const { columnKey } = props;
    if (onDeleteColumn) onDeleteColumn(columnKey);
  }

  function isItemHidden({ props, data }: PredicateParams) {
    if (data === 'edit') {
      return !state.editable || onEditColumn == undefined;
    } else if (data === 'delete') {
      return !state.editable || onDeleteColumn == undefined;
    } else if (data === 'freeze') {
      return props.frozen;
    } else {
      return !props.frozen;
    }
  }

  return (
    <Menu id={COLUMN_MENU_ID} animation={false} theme={theme.dark}>
      <Item onClick={onEditColumnClick} hidden={isItemHidden} data="edit">
        Edit column
      </Item>
      <Item onClick={onFreezeColumn} hidden={isItemHidden} data="freeze">
        Freeze column
      </Item>
      <Item onClick={onUnfreezeColumn} hidden={isItemHidden} data="unfreeze">
        Unfreeze column
      </Item>
      <Item onClick={onDeleteColumnClick} hidden={isItemHidden} data="delete">
        Delete Column
      </Item>
    </Menu>
  );
};
export default ColumnMenu;