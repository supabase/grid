# Supabase Grid

A react component to display your Postgresql table data.

## Usage

```js
<SupabaseGrid
  table="countries"
  clientProps={{
    supabaseUrl: '',
    supabaseKey: '',
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
4. Update **example/.env** file with your Supabase project URL and key
5. Run example app: `npm start`

## Contributing

- Fork the repo on [GitHub](https://github.com/supabase/grid)
- Clone the project to your own machine
- Commit changes to your own branch
- Push your work back up to your fork
- Submit a Pull request so that we can review your changes and merge

## License

This repo is licensed under MIT.
