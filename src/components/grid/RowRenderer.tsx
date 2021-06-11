import * as React from 'react';
import { TriggerEvent, useContextMenu } from 'react-contexify';
import { Row, RowRendererProps } from '@w3b6x9/react-data-grid-w3b6x9';
import { MENU_IDS } from '../menu';

export default function RowRenderer<R, SR>(props: RowRendererProps<R, SR>) {
  const { show: showContextMenu } = useContextMenu();

  function displayMenu(e: TriggerEvent) {
    const menuId = MENU_IDS.ROW_CONTEXT_MENU_ID;
    showContextMenu(e, {
      id: menuId,
      props: { rowIdx: props.rowIdx },
    });
  }

  return <Row {...props} onContextMenu={displayMenu} />;
}
