import * as React from 'react';
import {
  Typography,
  Button,
  IconXSquare,
  IconAlignJustify,
} from '@supabase/ui';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { useDispatch, useTrackedState } from '../../../store';
import { SegmentedControl } from '../../common';
import { DragItem } from '../../../types';

type SortRowProps = {
  columnId: string | number;
  index: number;
};

const SortRow: React.FC<SortRowProps> = ({ columnId, index }) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const column = state?.table?.columns.find(x => x.id === columnId);
  const sort = state?.sorts.find(x => x.columnId === columnId);
  if (!column || !sort) return null;

  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'sort-row',
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

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSort(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'sort-row',
    item: () => {
      return { columnId, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  function onToogle(value: string) {
    dispatch({
      type: 'UPDATE_SORT',
      payload: { columnId, order: value },
    });
  }

  function onDeleteClick() {
    dispatch({
      type: 'REMOVE_SORT',
      payload: columnId,
    });
  }

  const moveSort = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex == hoverIndex) return;
    dispatch({
      type: 'MOVE_SORT',
      payload: { fromIndex: dragIndex, toIndex: hoverIndex },
    });
  };

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      className="flex justify-between py-1"
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="flex items-center">
        <Button
          className="mr-4 p-2"
          icon={<IconXSquare />}
          shadow={false}
          size="tiny"
          type="text"
          onClick={onDeleteClick}
        />
        <Typography.Text>{column.name}</Typography.Text>
      </div>
      <div className="flex items-center w-32">
        <SegmentedControl
          options={['ASC', 'DESC']}
          value={sort.order}
          onToggle={onToogle}
        />
        <div className="ml-5">
          <IconAlignJustify size="tiny" />
        </div>
      </div>
    </div>
  );
};
export default SortRow;