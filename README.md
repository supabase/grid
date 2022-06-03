# Deprecated
🚨 **This repo has been deprecated.** 🚨

We've moved the grid component into the main [Supabase studio repo](https://github.com/supabase/supabase/tree/master/studio/components/grid) to make it easier to work on and to help us roll out bug fixes much quicker. We have [transfered all existing issues](https://github.com/supabase/supabase/issues?q=is%3Aissue+is%3Aopen+label%3Adashboard) in this repo, and we continue to welcome contributors over at [supabase/supabase](https://github.com/supabase/supabase/).

## Supabase Grid

A react component to display your Postgresql table data.

[![release](https://img.shields.io/github/release/supabase/grid.svg)](https://github.com/supabase/grid/releases/)
[![CI](https://github.com/supabase/grid/workflows/CI/badge.svg)](https://github.com/supabase/grid/actions?query=workflow%3ACI)

## Install

```bash
npm i @supabase/grid
```

This package requires some peer dependencies, which you need to install by yourself.

```bash
npm i react react-dom @supabase/react-data-grid @supabase/ui
```

## Usage

```js
<SupabaseGrid
  table="countries"
  onSqlQuery={async (query: string) => {
    // run query and return the result
  }}
/>
```

## Properties

#### Required

- `table` SupaTable object or table/view name.
  - readonly mode: support both table and view
  - editable mode: only for table
- `onSqlQuery` run sql query.

#### Optional

- `editable` enable table editor.
- `headerActions` react node to display in grid header.
- `gridProps` props to config grid view.
- `schema` table/view schema. Defaults to 'public'.
- `storageRef` storageRef is used to save state on localstorage.
- `theme` grid theme.
- `onAddColumn` show create new column button if available.
- `onAddRow` show add row button if available.
- `onError` error handler.
- `onEditColumn` show edit column menu if available.
- `onEditRow` show edit row button if available.
- `onDeleteColumn` show delete column menu if available.

## Run example

1. Build library: `npm start`
2. Go to example folder: `cd example`
3. Create **.env** file: `cp .env.example .env`
4. Update **example/.env** file with your Supabase project settings
5. Run example app: `npm start`

## Contributing

- Fork the repo on [GitHub](https://github.com/supabase/grid)
- Clone the project to your own machine
- Commit changes to your own branch
- Push your work back up to your fork
- Submit a Pull request so that we can review your changes and merge

## License

This repo is licensed under MIT.
