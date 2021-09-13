# Supabase Grid

A react component to display your Postgresql table data.

[![release](https://img.shields.io/github/release/supabase/grid.svg)](https://github.com/supabase/grid/releases/)
[![CI](https://github.com/supabase/grid/workflows/CI/badge.svg)](https://github.com/supabase/grid/actions?query=workflow%3ACI)

## Install

```bash
npm i @supabase/grid
```

This package requires some peer dependencies, which you need to install by yourself.

```bash
npm i react react-dom @monaco-editor/react @supabase/react-data-grid @supabase/supabase-js @supabase/ui
```

## Usage

```js
<SupabaseGrid
  table="countries"
  onSqlQuery={async (query: string) => {
    return {};
  }}
/>
```

`table` variable can be:

- SupaTable object
- Table or View name
  - Readonly: support both table and view
  - Editable: only for table. Required to create [Postgresql functions](FUNCTIONS.md) so that it can pull your table info.

## Properties

- `table` database table swagger or table name.
- `clientProps` props to create Supabase client.
- `gridProps` props to config grid view.
- `schema` table schema. Defaults to 'public'.
- `storageRef` storageRef is used to save state on localstorage.
- `editable` enable table editor.
- `headerActions` react node to display in grid header.
- `theme` grid theme.
- `onAddColumn` show create new column button if available.
- `onAddRow` show add row button if available.
- `onError` error handler.
- `onEditColumn` show edit column menu if available.
- `onDeleteColumn` show delete column menu if available.
- `onEditRow` show edit row button if available.

## Run example

1. Build library: `npm start`
2. Go to example folder: `cd example`
3. Create **.env** file: `cp .env.example .env`
4. Update **example/.env** file with your Supabase project settings
5. Run example app: `npm start`

## Enable table editor

1. Create the [helper functions](https://github.com/supabase/grid/blob/develop/FUNCTIONS.md) in your Postgres database's **public** schema
   > You can set the schema to public either with the `set search_path to public` statement above the
   > `create function` statements in your SQL console or
   > by prepending each function name with `public` e.g. `CREATE FUNCTION public.load_table_info`
2. Add the `editable` prop to the `SupabaseGrid` component

## Contributing

- Fork the repo on [GitHub](https://github.com/supabase/grid)
- Clone the project to your own machine
- Commit changes to your own branch
- Push your work back up to your fork
- Submit a Pull request so that we can review your changes and merge

## License

This repo is licensed under MIT.
