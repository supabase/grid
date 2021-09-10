import Query from '../src/query';

const query = new Query();

test('basic count table', async () => {
  const res = query.from('users').count().toSql();
  expect(res).toMatchSnapshot();
});
test('basic count table with filter', async () => {
  const res = query
    .from('users')
    .count()
    .filter('name', 'in', ['hello world', 'xin chao'])
    .toSql();
  expect(res).toMatchSnapshot();
});
