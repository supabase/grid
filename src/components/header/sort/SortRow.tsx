import * as React from 'react';
import { Typography, Button, IconMenu, IconX, Dropdown } from '@supabase/ui';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { useDispatch, useTrackedState } from '../../../store';
import { SegmentedControl } from '../../common';
import { DragItem } from '../../../types';

type SortRowProps = {
  columnName: string;
  index: number;
};

const SortRow: React.FC<SortRowProps> = ({ columnName, index }) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const column = state?.table?.columns.find((x) => x.name === columnName);
  const sort = state?.sorts.find((x) => x.columnName === columnName);
  if (!column || !sort) return null;

  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'sort-row',
    item: () => {
      return { key: columnName, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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

  function onToogle(value: string) {
    dispatch({
      type: 'UPDATE_SORT',
      payload: { columnName, ascending: value === 'ASC' },
    });
  }

  function onDeleteClick() {
    dispatch({
      type: 'REMOVE_SORT',
      payload: { columnName },
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
    <Dropdown.Misc>
      <div
        className="sb-grid-sort-row"
        ref={ref}
        style={{ opacity }}
        data-handler-id={handlerId}
      >
        <div className="sb-grid-sort-row__item">
          <Button
            icon={<IconX />}
            className="sb-grid-sort-row__item__remove"
            shadow={false}
            size="tiny"
            type="text"
            onClick={onDeleteClick}
          />
          <div className="sb-grid-sort-row__item__label">
            <Typography.Text type="secondary" small>
              {index > 0 ? 'then by' : 'sort by'}
            </Typography.Text>
            <Typography.Text>{column.name}</Typography.Text>
          </div>
        </div>
        <div className="sb-grid-sort-row__item">
          <SegmentedControl
            options={['ASC', 'DESC']}
            value={sort.ascending ? 'ASC' : 'DESC'}
            onToggle={onToogle}
          />
          <div>
            <Typography.Text className="sb-grid-sort-row__item__move">
              <IconMenu size="tiny" />
            </Typography.Text>
          </div>
        </div>
      </div>
    </Dropdown.Misc>
  );
};
export default React.memo(SortRow);
