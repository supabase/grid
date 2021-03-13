import * as React from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { SortableHeaderCell } from '@phamhieu1998/react-data-grid';
import { useDispatch } from '../../store';
import { ColumnHeaderProps, DragItem } from '../../types';

export function ColumnHeader<R>({ column }: ColumnHeaderProps<R>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const index = column.idx;

  const [{ isDragging }, drag] = useDrag({
    type: 'grid-column-header',
    item: () => {
      return { columnId: column.key, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: 'grid-column-header',
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
      const hoverIndex = index;

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
      moveColumn(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex == hoverIndex) return;
    dispatch({
      type: 'MOVE_COLUMN',
      payload: { fromIndex: dragIndex, toIndex: hoverIndex },
    });
  };

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      style={{
        cursor: 'move',
        opacity,
      }}
    >
      <SortableHeaderCell column={column}>{column.name}</SortableHeaderCell>
    </div>
  );
}
