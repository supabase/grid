import { Column } from '@phamhieu1998/react-data-grid';
import { SavedState } from '../types';
import { deepClone } from './common';

export function cloneColumn(column: Column<any, any>) {
  const cloned = deepClone(column);
  // these properties can't be cloned. Need to manual re-set again
  cloned.editor = column.editor;
  cloned.headerRenderer = column.headerRenderer;
  return cloned;
}

export function getInitialGridColumns(
  gridColumns: Column<any, any>[],
  savedState?: SavedState
) {
  let result = gridColumns;
  if (savedState?.gridColumns) {
    result = [];
    for (let i = 0; i < savedState.gridColumns.length; i++) {
      const x = savedState.gridColumns[i];
      const found = gridColumns.find(y => y.key === x.name);
      // merge with savedState item props: width
      if (found) result.push({ ...found, width: x.width, frozen: x.frozen });
    }
    // console.log('exist grid columns', result);
    // check for newly created columns
    const newGridColumns = gridColumns.filter(x => {
      const found = savedState.gridColumns.find(y => y.key === x.name);
      return found ? false : true;
    });
    // console.log('newGridColumns', newGridColumns);
    result.concat(newGridColumns);
  }
  return result;
}
