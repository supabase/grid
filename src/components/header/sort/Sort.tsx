import * as React from 'react';
import {
  Dropdown,
  Typography,
  Divider,
  Menu,
  Button,
  IconSettings,
} from '@supabase/ui';

type SortProps = {};

const Sort: React.FunctionComponent<SortProps> = ({}) => {
  // const [visible, setVisible] = React.useState(false);

  // function onVisibleChange(value: boolean) {
  //   setVisible(value);
  // }

  return (
    <>
      <Dropdown.Item>
        <Typography.Text>Signed in as </Typography.Text>
        <Typography.Text strong>tom@example.com . </Typography.Text>
      </Dropdown.Item>
      <Divider light />
      <Menu>
        <Menu.Item icon={<IconSettings size="tiny" />}>Settings</Menu.Item>
        <Divider light />
        <Menu.Item>Something</Menu.Item>
        <Menu.Item>Something</Menu.Item>
      </Menu>
      <Divider light />,
      <Dropdown.Item>
        <Button type="default">Log out</Button>
      </Dropdown.Item>
    </>
  );
};
export default Sort;
