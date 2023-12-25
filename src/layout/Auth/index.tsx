import { Outlet } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import * as s from './styles';

const Auth: React.FC = () => {
  return (
    <s.Container>
      <s.GridContainer container>
        <s.GridRightItem xs={12} lg={6} item sx={{ mt: { sm: 10, xs: 10 } }}>
          <Container maxWidth="sm">
            <s.GridRightContent>
              <Typography
                align="center"
                fontWeight={'bold'}
                mb={2}
                variant="h5"
              >
                Welcome to Blogging Platform
              </Typography>
            </s.GridRightContent>
          </Container>
        </s.GridRightItem>
        <s.GridLeftItem xs={12} lg={6} item>
          <s.GridLeftContent>
            <Outlet />
          </s.GridLeftContent>
        </s.GridLeftItem>
      </s.GridContainer>
    </s.Container>
  );
};

export default Auth;
