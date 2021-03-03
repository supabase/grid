# Supabase Grid

## Postgresql Functions

#### Load table info

```sql
CREATE FUNCTION load_table_info(filter_schema text, filter_name text)
returns table (
  id int8,
  schema name,
  name name,
  rows_estimate int8,
  comment text
) LANGUAGE PLPGSQL
AS $$
BEGIN
  RETURN query
    SELECT
      c.oid :: int8 AS id,
      nc.nspname AS schema,
      c.relname AS name,
      pg_stat_get_live_tuples(c.oid) AS live_rows_estimate,
      obj_description(c.oid) AS comment
    FROM
      pg_namespace nc
      JOIN pg_class c ON nc.oid = c.relnamespace
    WHERE
      nc.nspname = filter_schema
      AND c.relname = filter_name
      AND c.relkind IN ('r', 'p')
      AND NOT pg_is_other_temp_schema(nc.oid)
      AND (
        pg_has_role(c.relowner, 'USAGE')
        OR has_table_privilege(
          c.oid,
          'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
        )
        OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
      );
END
$$;
```
