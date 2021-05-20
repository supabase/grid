import React, { createContext, useContext } from 'react';

interface ContextProps {
  formContextOnChange: any;
  onEditRow: any;
  onEditColumn: any;
  onDeleteColumn: any;
  editable: boolean;
}
// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
const FormContext = createContext<ContextProps>({
  formContextOnChange: null,
  onEditRow: null,
  onEditColumn: null,
  onDeleteColumn: null,
  editable: false,
});

export const MenuContextProvider = (props: any) => {
  const { formContextOnChange } = props;

  const value = {
    formContextOnChange: formContextOnChange,
  };
  return (
    <FormContext.Provider value={value} {...props}>
      {props.children}
    </FormContext.Provider>
  );
};

// context helper to avoid using a consumer component
export const useMenuContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error(
      `ContextProps like onEditRow, onEditColumn, onDeleteColumn... must be used within a MenuContextProvider.`
    );
  }
  return context;
};
