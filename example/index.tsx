// https://github.com/parcel-bundler/parcel/issues/1762
import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupabaseGrid } from '../.';
// import countries from './countries'

const App = () => {
  // READONLY
  // using postgrest OpenApi description to retrieve table, column definition
  // so it supports both table, view
  return (
    <div style={{ height: '100vh' }}>
      <SupabaseGrid
        table="countries_view"
        storageRef="dqofwyqljsmbgrubmnzk"
        clientProps={{
          supabaseUrl: 'https://eswutwdkpzgacrlriize.supabase.net',
          supabaseKey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNzA3NTU4OCwiZXhwIjoxOTMyNjUxNTg4fQ.h1TuIObta3ZBAgJ-XefdQGgFaFCFIEwQIlSHxcd4o18',
        }}
        gridProps={{ height: '100%' }}
      />
    </div>
  );

  // EDITABLE
  // using stored procedure to retrieve table, column definition
  // so it ONLY support table
  // return (
  //   <div style={{ height: '100vh' }}>
  //     <SupabaseGrid
  //       table="countries"
  //       editable={true}
  //       // table={countries}
  //       onAddColumn={() => {
  //         console.log('add new column');
  //       }}
  //       onEditColumn={columnName => {
  //         console.log('edit column: ', columnName);
  //       }}
  //       onDeleteColumn={columnName => {
  //         console.log('delete column: ', columnName);
  //       }}
  //       onAddRow={() => {
  //         console.log('add new row');
  //         return {};
  //       }}
  //       onEditRow={rowIdx => {
  //         console.log('edit row: ', rowIdx);
  //       }}
  //       storageRef="dqofwyqljsmbgrubmnzk"
  //       clientProps={{
  //         supabaseUrl: 'https://fryzipnbzhtjjdgwipxv.supabase.net',
  //         supabaseKey:
  //           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjM3MzI5MiwiZXhwIjoxOTMxOTQ5MjkyfQ.YL3ofzqrcrK63GlyuV3NQii6yw5VHoPI6WSs4hirHyU',
  //       }}
  //       gridProps={{ height: '100%' }}
  //     />
  //   </div>
  // );
};

ReactDOM.render(<App />, document.getElementById('root'));
