// https://github.com/parcel-bundler/parcel/issues/1762
import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupabaseGrid } from '../.';
// import countries from './countries'

const App = () => {
  return (
    <div style={{ height: '100vh' }}>
      <SupabaseGrid
        table="countries"
        // table={countries}
        onAddColumn={() => {
          console.log('add new column');
        }}
        onEditColumn={columnId => {
          console.log('edit column: ', columnId);
        }}
        onDeleteColumn={columnId => {
          console.log('delete column: ', columnId);
        }}
        onAddRow={() => {
          console.log('add new row');
          return {};
        }}
        onEditRow={rowIdx => {
          console.log('edit row: ', rowIdx);
        }}
        storageRef="dqofwyqljsmbgrubmnzk"
        clientProps={{
          supabaseUrl: 'https://dqofwyqljsmbgrubmnzk.supabase.net',
          supabaseKey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE0ODE0ODc4LCJleHAiOjE5MzAzOTA4Nzh9.CjLbUVvuw0YrFcjpqDMUMZmef2_v3MFjCo4-Z4C9_0Q',
        }}
        gridProps={{ height: '100%' }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
