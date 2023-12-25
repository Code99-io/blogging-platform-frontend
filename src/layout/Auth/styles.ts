import { Box, Grid, Stack, styled } from '@mui/material';

const Container = styled(Box)`
  display: flex;
  flex: 1 1 auto;
  height: 100vh;
`;

const GridContainer = styled(Grid)`
  flex: 1 1 auto;
`;

const GridLeftItem = styled(Grid)`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const GridLeftContent = styled(Box)`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  padding: ${(props) => props.theme.spacing(3)};
`;

const GridRightItem = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    max-width: 100%;
  }
`;

const GridRightContent = styled(Stack)`
  padding: ${(props) => props.theme.spacing(3)};
  align-items: center;
  justify-content: center;
`;

export {
  Container,
  GridContainer,
  GridLeftItem,
  GridLeftContent,
  LogoContainer,
  GridRightItem,
  GridRightContent,
};
