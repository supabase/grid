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
  const [tableName, setName] = React.useState('test-table');
  const [uiMode, setUiMode] = React.useState('');
  const isReadonly = tableName == 'countries_view';

  function showTestTable() {
    setName('test-table');
  }

  function showCountriesTable() {
    setName('countries');
  }

  function showCountriesView() {
    setName('countries_view');
  }

  function onRowAdded() {
    if (gridRef.current) gridRef.current.rowAdded({});
  }

  function onToggleDarkMode() {
    let mode = '';
    if (uiMode != 'dark') mode = 'dark';

    setUiMode(mode);
    document.body.className = mode;
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
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', height: '3vh', marginBottom: '10px' }}>
        <button onClick={showTestTable}>Test Table</button>
        <button onClick={showCountriesTable}>Countries Table</button>
        <button onClick={showCountriesView}>Countries View</button>
        <button onClick={onRowAdded} style={{ marginLeft: '1rem' }}>
          Trigger Row Added
        </button>
        <button onClick={onToggleDarkMode} style={{ marginLeft: '1rem' }}>
          Dark Mode Toggle
        </button>
      </div>
      <div style={{ height: '95vh' }}>
        {isReadonly ? renderReadonlyTable() : renderTable()}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
