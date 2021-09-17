import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { PropsWithChildren } from 'react';

/**
 * https://github.com/react-dnd/react-dnd/issues/186#issuecomment-793063023
 * error: Cannot have two HTML5 backends at the same time
 */
function DragAndDrop({ children }: PropsWithChildren<{}>): JSX.Element {
  return (
    <DndProvider backend={HTML5Backend} key={Math.random()}>
      {children}
    </DndProvider>
  );
}

export default DragAndDrop;
