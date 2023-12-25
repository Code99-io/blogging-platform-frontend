import { Box, Stack, SxProps, styled } from '@mui/material';

const Container = styled(Box)`
  height: 100%;
`;

const Header = styled(Stack)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const HeaderRightContainer = styled(Stack)`
  align-items: center;
  justify-content: space-between;
`;

const styledForSearchField: SxProps = {
  width: 260,
};

export { Container, Header, HeaderRightContainer, styledForSearchField };
