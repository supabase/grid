import React from 'react';
import { SupabaseGrid, SupabaseGridRef, SupaRow } from '@supabase/grid';
import { createClient } from '@supabase/supabase-js';
import { postAndWait } from './grid.utils';

export default function Grid() {
  const gridRef = React.useRef<SupabaseGridRef>(null);
  const [tableInput, setTableInput] = React.useState('test_table');
  const [schemaInput, setSchemaInput] = React.useState('public');
  const [table, setTable] = React.useState({
    name: 'test_table',
    schema: 'public',
  });
  const [uiMode, setUiMode] = React.useState<'dark' | 'light' | undefined>(
    undefined
  );
  const [isReadonly, setReadonly] = React.useState(true);
  const [reload, setReload] = React.useState(false);
  let supabase = createClient(
    `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co`,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      localStorage: undefined,
      detectSessionInUrl: false,
    }
  );

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
    if (tableInput !== table.name || schemaInput !== table.schema) {
      setTable({ name: tableInput, schema: schemaInput });
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

  return (
    <div className="main-container">
      <div className="tool-bar">
        <input
          value={schemaInput}
          placeholder="Schema name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSchemaInput(e.target.value);
          }}
        />
        <input
          value={tableInput}
          placeholder="Table name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTableInput(e.target.value);
          }}
          style={{ marginLeft: '10px' }}
        />
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
        <div className="grid-container">
          <SupabaseGrid
            ref={gridRef}
            table={table.name}
            schema={table.schema}
            editable={!isReadonly}
            storageRef="dqofwyqljsmbgrubmnzk"
            theme={uiMode}
            gridProps={{ height: '100%' }}
            onError={(error) => {
              console.log('ERROR: ', error);
            }}
            onAddColumn={() => {
              console.log('add new column');
            }}
            onEditColumn={(columnName) => {
              console.log('edit column: ', columnName);
            }}
            onDeleteColumn={(columnName) => {
              console.log('delete column: ', columnName);
            }}
            onAddRow={() => {
              console.log('add new row');
              return {};
            }}
            onEditRow={(row: SupaRow) => {
              console.log('edit row: ', row.idx);
            }}
            onSqlQuery={async (query: string) => {
              const res = await postAndWait('/api/sql-query', { query });
              return res;
            }}
            supabaseStorageClient={supabase.storage}
            headerActions={
              <>
                <span>{`'{headerActions}' can be used to insert`}</span>,
                <button>react nodes here</button>,
              </>
            }
          />
        </div>
      )}
    </div>
  );
}
