import Query from '../src/query';

const query = new Query();

test('basic delete on table', async () => {
  const res = query
    .from('users')
    .delete()
    .filter('name', '=', 'hello world')
    .toSql();
  expect(res).toMatchSnapshot();
});
test('delete with returning record on table', async () => {
  const res = query
    .from('users')
    .delete({ returning: true })
    .filter('name', '=', 'hello world')
    .toSql();
  expect(res).toMatchSnapshot();
});
test('error on delete without filter', async () => {
  expect(() => {
    query.from('users').delete({ returning: true }).toSql();
  }).toThrow();
});
test('delete should ignore order', async () => {
  const res = query
    .from('users')
    .delete({ returning: true })
    .filter('name', '=', 'hello world')
    .order('name')
    .toSql();
  expect(res).toMatchSnapshot();
});
