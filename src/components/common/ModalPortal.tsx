import * as React from 'react';
import { createPortal } from 'react-dom';

export const ModalPortal: React.FC = ({ children }) => {
  const [elementRef, setElementRef] = React.useState<HTMLDivElement>();

  React.useEffect(() => {
    const element = document.createElement('div');
    document.body.append(element);
    setElementRef(element);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  if (!elementRef) return null;
  return createPortal(children, elementRef);
};
