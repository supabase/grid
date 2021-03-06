import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupabaseGrid } from '../src';

describe('<SupabaseGrid />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <SupabaseGrid
        table=""
        onSqlQuery={async (query: string) => {
          return { error: { message: query } };
        }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
