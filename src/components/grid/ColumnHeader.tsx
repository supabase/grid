import * as React from 'react';
import {
  Button,
  IconChevronDown,
  IconBox,
  IconClock,
  IconKey,
  IconType,
  IconLink,
  IconHash,
  IconCheckCircle,
  IconList,
  IconCalendar,
} from '@supabase/ui';
import { TriggerEvent, useContextMenu } from 'react-contexify';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { SortableHeaderCell } from '@supabase/react-data-grid';
import { useDispatch } from '../../store';
import { ColumnHeaderProps, ColumnType, DragItem } from '../../types';
import { MENU_IDS } from '../menu';

export function ColumnHeader<R>({ column, columnType }: ColumnHeaderProps<R>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<any>(null);
  const dispatch = useDispatch();
  const columnIdx = column.idx;
  const columnKey = column.key;

  const { show: showContextMenu } = useContextMenu({
    id: MENU_IDS.COLUMN_MENU_ID,
  });

  function getMenuPosition() {
    const { left, bottom } = triggerRef?.current.button.getBoundingClientRect();
    return { x: left, y: bottom + 8 };
  }

  function displayMenu(e: TriggerEvent) {
    showContextMenu(e, {
      position: getMenuPosition(),
      props: { columnKey, frozen: column.frozen },
    });
  }

  const [{ isDragging }, drag] = useDrag({
    type: 'column-header',
    item: () => {
      return { key: columnKey, index: columnIdx };
    },
    canDrag: () => !column.frozen,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: 'column-header',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const dragKey = item.key;
      const hoverIndex = columnIdx;
      const hoverKey = columnKey;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width

      // Dragging left
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging right
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveColumn(dragKey, hoverKey);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const moveColumn = (fromKey: string, toKey: string) => {
    if (fromKey == toKey) return;
    dispatch({
      type: 'MOVE_COLUMN',
      payload: { fromKey, toKey },
    });
  };

  const opacity = isDragging ? 0 : 1;
  const cursor = column.frozen ? 'cursor-default' : '';
  drag(drop(ref));

  return (
    <div ref={ref} data-handler-id={handlerId} style={{ opacity }}>
      <SortableHeaderCell column={column}>
        <div className={`flex items-center ${cursor}`}>
          <div>{renderColumnIcon(columnType)}</div>
          <span className="inline-block ml-2 flex-grow overflow-hidden overflow-ellipsis text-sm">
            {column.name}
          </span>
          <Button
            type="text"
            className="ml-3"
            ref={triggerRef}
            icon={<IconChevronDown />}
            onClick={displayMenu}
            style={{ padding: '3px' }}
          />
        </div>
      </SortableHeaderCell>
    </div>
  );
}

function renderColumnIcon(type: ColumnType) {
  switch (type) {
    case 'boolean':
      return <IconCheckCircle size="tiny" />;
    case 'date':
      return <IconCalendar size="tiny" />;
    case 'datetime':
      return <IconClock size="tiny" />;
    case 'time':
      return <IconClock size="tiny" />;
    case 'enum':
      return <IconList size="tiny" />;
    case 'foreign_key':
      return <IconLink size="tiny" />;
    case 'json':
      return <IconBox size="tiny" />;
    case 'number':
      return <IconHash size="tiny" />;
    case 'primary_key':
      return <IconKey size="tiny" />;
    case 'text':
      return <IconType size="tiny" />;
    default:
      return null;
  }
}
