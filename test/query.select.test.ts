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
test('select table with order', async () => {
  const res = query.from('users').select().order('name').toSql();
  expect(res).toMatchSnapshot();
});
test('select table with order descending null lass', async () => {
  const res = query.from('users').select().order('name', false, false).toSql();
  expect(res).toMatchSnapshot();
});
test('select table with multi orders', async () => {
  const res = query
    .from('users')
    .select()
    .order('name')
    .order('age', false)
    .toSql();
  expect(res).toMatchSnapshot();
});
test('select table with filter', async () => {
  const res = query
    .from('users')
    .select()
    .filter('name', '=', 'hello world')
    .toSql();
  expect(res).toMatchSnapshot();
});
test('select table with match filter', async () => {
  const res = query
    .from('users')
    .select()
    .match({ name: 'hello world', birth_year: 1988 })
    .toSql();
  expect(res).toMatchSnapshot();
});
test('select table with in filter', async () => {
  const res = query
    .from('users')
    .select()
    .filter('name', 'in', 'hello world, xin chao')
    .toSql();
  expect(res).toMatchSnapshot();
});
test('select table with multi filters', async () => {
  const res = query
    .from('users')
    .select()
    .filter('name', '=', 'hello world')
    .filter('age', '>', 18)
    .toSql();
  expect(res).toMatchSnapshot();
});
test('select table with filter and order', async () => {
  const res = query
    .from('users')
    .select()
    .filter('name', '=', 'hello world')
    .filter('age', '>', 18)
    .order('id')
    .toSql();
  expect(res).toMatchSnapshot();
});
