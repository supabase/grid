// https://github.com/parcel-bundler/parcel/issues/1762
import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupabaseGrid, SupabaseGridRef } from '../.';
import './style.css';

const clientProps = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY || '',
};

const App = () => {
  const gridRef = React.useRef<SupabaseGridRef>(null);
  const [inputValue, setInputValue] = React.useState('test_table');
  const [tableName, setName] = React.useState('test_table');
  const [uiMode, setUiMode] = React.useState<'dark' | 'light' | undefined>(
    undefined
  );
  const [isReadonly, setReadonly] = React.useState(true);
  const [reload, setReload] = React.useState(false);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function onReadonlyInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReadonly(e.target.checked);
    // force reload grid
    reloadGrid();
  }

  function onRowAdded() {
    if (gridRef.current) gridRef.current.rowAdded({});
  }

  function onToggleDarkMode() {
    let mode = '';
    if (uiMode != 'dark') mode = 'dark';

    setUiMode(mode == 'dark' ? 'dark' : undefined);
    document.body.className = mode;
  }

  function reloadGrid() {
    if (inputValue !== tableName) {
      setName(inputValue);
    } else {
      setReload(true);
      setTimeout(() => {
        setReload(false);
      }, 300);
    }
  }

  React.useEffect(() => {
    if (uiMode == 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [uiMode]);

  // READONLY
  // using postgrest OpenApi description to retrieve table, column definition
  // so it supports both table, view
  function renderReadonlyTable() {
    return (
      <SupabaseGrid
        ref={gridRef}
        table={tableName}
        storageRef="dqofwyqljsmbgrubmnzk"
        clientProps={clientProps}
        theme={uiMode}
        gridProps={{ height: '100%' }}
      />
    );
  }

  // EDITABLE
  // using stored procedure to retrieve table, column definition
  // so it ONLY support table
  function renderTable() {
    return (
      <SupabaseGrid
        ref={gridRef}
        table={tableName}
        editable={true}
        storageRef="dqofwyqljsmbgrubmnzk"
        clientProps={clientProps}
        theme={uiMode}
        gridProps={{ height: '100%' }}
        onError={error => {
          console.log('ERROR: ', error);
        }}
        onAddColumn={() => {
          console.log('add new column');
        }}
        onEditColumn={columnName => {
          console.log('edit column: ', columnName);
        }}
        onDeleteColumn={columnName => {
          console.log('delete column: ', columnName);
        }}
        onAddRow={() => {
          console.log('add new row');
          return {};
        }}
        onEditRow={rowIdx => {
          console.log('edit row: ', rowIdx);
        }}
        headerActions={
          <>
            <span>{`'{headerActions}' can be used to insert`}</span>,
            <button>react nodes here</button>,
          </>
        }
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', height: '3vh', marginBottom: '10px' }}>
        <input value={inputValue} onChange={onInputChange} />
        <button onClick={reloadGrid} style={{ marginLeft: '10px' }}>
          Reload Data Grid
        </button>
        <label style={{ marginLeft: '10px' }}>
          readonly:
          <input
            name="readonly"
            type="checkbox"
            checked={isReadonly}
            onChange={onReadonlyInputChange}
          />
        </label>
        <button onClick={onRowAdded} style={{ marginLeft: '1rem' }}>
          Trigger Row Added
        </button>
        <button onClick={onToggleDarkMode} style={{ marginLeft: '1rem' }}>
          Dark Mode Toggle
        </button>
      </div>
      {!reload && (
        <div style={{ height: '95vh' }}>
          {isReadonly ? renderReadonlyTable() : renderTable()}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
