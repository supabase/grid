import * as React from 'react';
import SortRow from './SortRow';

type SortProps = {};

const Sort: React.FunctionComponent<SortProps> = ({}) => {
  // const [visible, setVisible] = React.useState(false);

  // function onVisibleChange(value: boolean) {
  //   setVisible(value);
  // }

  return (
    <>
      <SortRow columnId="16525.1" order="desc" />
      <SortRow columnId="16525.3" order="desc" />
      <SortRow columnId="16525.4" order="asc" />
    </>
  );
};
export default Sort;
