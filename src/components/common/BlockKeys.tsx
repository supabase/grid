import * as React from 'react';

type BlockKeysProps = {
  onEscape?: () => void;
  onEnter?: () => void;
};

/**
 * Blocks key events from propagating
 * We use this with cell editor to allow editor component to handle keys.
 * Example: press enter to add newline on textEditor
 */
export const BlockKeys: React.FC<BlockKeysProps> = ({
  onEscape,
  onEnter,
  children,
}) => {
  const handleKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      switch (ev.key) {
        case 'Escape':
          ev.stopPropagation();
          if (onEscape) onEscape();
          break;
        case 'Enter':
          ev.stopPropagation();
          if (onEnter) onEnter();
          break;
      }
    },
    []
  );
  return <div onKeyDown={handleKeyDown}>{children}</div>;
};
