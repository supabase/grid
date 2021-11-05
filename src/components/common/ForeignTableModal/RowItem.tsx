import * as React from 'react';
import { Menu, Typography } from '@supabase/ui';
import { Dictionary } from '../../../types';

interface RowItemProps {
  item: Dictionary<any>;
  onSelect: (item: Dictionary<any>) => void;
}

export const RowItem: React.FC<RowItemProps> = ({ item, onSelect }) => {
  const keys = Object.keys(item);
  return (
    <div className="foreign-table-modal__row-item">
      <Menu.Item onClick={() => onSelect(item)}>
        <div className="foreign-table-modal__row-item__inner">
          {keys.map((key, j) => {
            //
            // limit to 5 attributes
            //
            // this could be improved so the user could pick which attributes to display
            // @mildtomato
            if (j > 5) return null;

            return (
              <div
                className="foreign-table-modal__row-item__inner__key-item"
                key={`item-${j}`}
              >
                <Typography.Text
                  small
                  type="secondary"
                  className="foreign-table-modal__row-item__inner__key-item__key"
                >
                  {key}
                </Typography.Text>
                <Typography.Text small strong>
                  {item[key] || '[null]'}
                </Typography.Text>
              </div>
            );
          })}
        </div>
      </Menu.Item>
    </div>
  );
};
