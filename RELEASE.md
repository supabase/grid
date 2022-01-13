# Releases

Releases are handled by Semantic release. This document is for forcing and documenting any non-code changes.

## 2.4.0

- fix copy cell bug

## 2.0.0

- Remove @supabase-js dependency
- Add peer dependencies
- Fixes bug

#### Breaking changes

**Install**

Previously:

```bash
npm i @supabase/grid
```

Now:

```bash
npm i @supabase/grid
npm i react react-dom @supabase/react-data-grid @supabase/ui
```

**Usage**

Previously:

```jsx
<SupabaseGrid
  table="countries"
  clientProps={{
    supabaseUrl: '',
    supabaseKey: '',
  }}
/>
```

Now:

```jsx
<SupabaseGrid
  table="countries"
  onSqlQuery={async (query: string) => {
    // run query and return the result
  }}
/>
```
