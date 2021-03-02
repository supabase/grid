import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SupabaseGrid from '../dist';
import {
  EditableGridCell,
  GridCell,
  GridCellKind,
} from '@glideapps/glide-data-grid';

const App = () => {
  function getData([col, row]: readonly [number, number]): GridCell {
    let n: number;
    if (col === 0) {
      n = row;
    } else if (col === 1) {
      n = row * row;
    } else if (col === 2) {
      const value = !(row % 2) ? false : true;
      return {
        kind: GridCellKind.Boolean,
        data: value,
        showUnchecked: true,
        allowOverlay: true,
        allowEdit: true,
      };
    } else {
      throw new Error('This should not happen');
    }
    return {
      kind: GridCellKind.Text,
      data: n + '',
      displayData: n.toString(),
      allowOverlay: true,
    };
  }

  function onCellEdited(
    cell: readonly [number, number],
    newValue: EditableGridCell
  ) {
    console.log('cell', cell, 'newValue', newValue);
  }

  return (
    <div>
      <SupabaseGrid
        columns={[
          { title: 'Number', width: 100 },
          { title: 'Square', width: 100 },
          { title: 'Is Cool', width: 100 },
        ]}
        getCellContent={getData}
        onCellEdited={onCellEdited}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
