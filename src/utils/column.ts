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
      const state = savedState.gridColumns[i];
      const found = gridColumns.find(y => y.key === state.name);
      // merge with savedState item props: width
      if (found)
        result.push({ ...found, width: state.width, frozen: state.frozen });
    }
    // check for newly created columns
    const newGridColumns = gridColumns.filter(x => {
      const found = savedState.gridColumns.find(state => state.name === x.key);
      return !found;
    });
    result = result.concat(newGridColumns);
  }
  return result;
}
