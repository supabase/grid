import { formatLiteral } from '../src/query/Query.utils';

test('format array literal', async () => {
  const format = formatLiteral([321.23, 23, 54.6]);
  expect(format).toMatchSnapshot();
});
test('format json literal', async () => {
  const format = formatLiteral({ firstName: 'aaaa', lastName: 'bbb' });
  expect(format).toMatchSnapshot();
});
test('format complex json literal', async () => {
  const format = formatLiteral({
    firstName: 'aaaa',
    lastName: 'bbb',
    numbers: [1, 54, 6.7, 34.5],
  });
  expect(format).toMatchSnapshot();
});
