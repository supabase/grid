import Query from '../src/query';

const query = new Query();

test('basic insert on table', async () => {
  const res = query
    .from('test_table')
    .insert({
      text_col: 'lorem ipsum',
      json_col: { firstName: 'aaa', lastName: 'bbb' },
      number_array_col: '{1,2,3,4,5}',
      text_array_col: "{'aa', 'bb', 'cc', 'dd'}",
    })
    .toSql();
  expect(res).toMatchSnapshot();
});
test('insert should ignore order and filter', async () => {
  const res = query
    .from('users')
    .insert({ name: 'aaaaa', age: 24 })
    .filter('age', '<', '30')
    .order('name')
    .toSql();
  expect(res).toMatchSnapshot();
});
