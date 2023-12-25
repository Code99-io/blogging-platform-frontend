import { Box, styled } from '@mui/material';

const Root = styled(Box)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px - 64px);
`;

const Content = styled(Box)`
  height: 100%;
  padding: ${(props) => props.theme.spacing(6)};
`;

export { Root, Content };
