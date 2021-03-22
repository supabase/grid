import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupabaseGrid } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <SupabaseGrid
        table=""
        clientProps={{
          supabaseUrl: '',
          supabaseKey: '',
        }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
