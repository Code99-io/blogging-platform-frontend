import * as React from 'react';
import { Outlet } from 'react-router-dom';
import * as s from './styles';
import { useMediaQuery } from '@mui/material';
import { Header, Sidebar } from '../../components/ui';

const Dashboard = (): React.ReactElement => {
  const [open, setOpen] = React.useState(false);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

  return (
    <>
      <Header open={open} setOpen={setOpen} />
      <s.Root sx={{ pl: lgUp ? 30 : undefined }}>
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <s.Content>
          <Outlet />
        </s.Content>
      </s.Root>
    </>
  );
};

export default Dashboard;
