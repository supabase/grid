import Query from '../src/query';

const query = new Query();

test('basic count table', async () => {
  const res = query.from('users').count().toSql();
  expect(res).toMatchSnapshot();
});
test('count table with filter', async () => {
  const res = query
    .from('users')
    .count()
    .filter('name', 'in', 'hello world, xin chao')
    .toSql();
  expect(res).toMatchSnapshot();
});
test('count table with multi filters', async () => {
  const res = query
    .from('users')
    .count()
    .filter('name', 'in', 'hello world, xin chao')
    .filter('age', '>', 18)
    .filter('birth_year', '>=', 2000)
    .toSql();
  expect(res).toMatchSnapshot();
});
test('count table should ignore order', async () => {
  const res = query
    .from('users')
    .count()
    .filter('name', 'in', 'hello world, xin chao')
    .order('name')
    .order('age')
    .toSql();
  expect(res).toMatchSnapshot();
});
