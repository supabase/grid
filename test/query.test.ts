import Query from '../src/query';

const query = new Query();

test('basic select table', async () => {
  const res = query.from('users').select().toSql();
  expect(res).toMatchSnapshot();
});
test('select table with custom schema', async () => {
  const res = query.from('users', 'ext').select().toSql();
  expect(res).toMatchSnapshot();
});
test('select table with Capital name, schema', async () => {
  const res = query.from('UsErs', 'Ext').select().toSql();
  expect(res).toMatchSnapshot();
});
test('select table with columns', async () => {
  const res = query.from('users').select(['name', 'id', 'age']).toSql();
  expect(res).toMatchSnapshot();
});
test('select table with Capital columns', async () => {
  const res = query.from('users').select(['Name', 'id', 'Age']).toSql();
  expect(res).toMatchSnapshot();
});
test('select table with pagination', async () => {
  const res = query.from('users').select().range(0, 99).toSql();
  expect(res).toMatchSnapshot();
});
