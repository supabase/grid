import Query from '../src/query';

const query = new Query();

test('basic update on table', async () => {
  const res = query
    .from('users')
    .update({ young: true })
    .filter('age', '<', 30)
    .toSql();
  expect(res).toMatchSnapshot();
});
test('update with returning record on table', async () => {
  const res = query
    .from('users')
    .update({ young: true }, { returning: true })
    .filter('name', '=', 'hello world')
    .toSql();
  expect(res).toMatchSnapshot();
});
test('error on update without filter', async () => {
  expect(() => {
    query.from('users').update({ young: true }).toSql();
  }).toThrow();
});
test('update should ignore order', async () => {
  const res = query
    .from('users')
    .update({ young: true })
    .filter('age', '<', 30)
    .order('name')
    .toSql();
  expect(res).toMatchSnapshot();
});
test('update with json column', async () => {
  const res = query
    .from('users')
    .update({
      profile: { firstName: 'aaaa', lastName: 'bbb' },
      numbers: [1, 2, 43, 5.5, 6],
    })
    .filter('name', '=', 'hello world')
    .toSql();
  expect(res).toMatchSnapshot();
});
