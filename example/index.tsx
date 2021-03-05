import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SupabaseGrid from '../.';
// import countries from './countries'

const App = () => {
  return (
    <div>
      <SupabaseGrid
        table="employees"
        // table={countries}
        clientProps={{
          supabaseUrl: 'https://dqofwyqljsmbgrubmnzk.supabase.net',
          supabaseKey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE0ODE0ODc4LCJleHAiOjE5MzAzOTA4Nzh9.CjLbUVvuw0YrFcjpqDMUMZmef2_v3MFjCo4-Z4C9_0Q',
        }}
        gridProps={{ width: 1000, height: 600 }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
