// https://github.com/parcel-bundler/parcel/issues/1762
import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import 'react-contexify/dist/ReactContexify.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupabaseGrid, SupabaseGridRef } from '../.';
// import countries from './countries'

const clientProps = {
  supabaseUrl: 'https://elwnyzeispughydvblgw.supabase.co',
  supabaseKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDAwMTg0NSwiZXhwIjoxOTM1NTc3ODQ1fQ.NqLZjLKCukqjVfiynZ41Fsq7ih8U2JmvWYYlGtcuELo',
};

const App = () => {
  const gridRef = React.useRef<SupabaseGridRef>(null);
  const [tableName, setName] = React.useState('countries');
  const isReadonly = tableName == 'countries_view';

  function onClick() {
    const name = tableName == 'countries_view' ? 'countries' : 'countries_view';
    setName(name);
  }

  function onRowAdded() {
    if (gridRef.current) gridRef.current.rowAdded({});
  }

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
      <div style={{ display: 'flex', height: '5vh' }}>
        <button onClick={onClick}>Change Table</button>
        <button onClick={onRowAdded} style={{ marginLeft: '1rem' }}>
          Row Added
        </button>
      </div>
      <div style={{ height: '95vh' }}>
        {isReadonly ? renderReadonlyTable() : renderTable()}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
