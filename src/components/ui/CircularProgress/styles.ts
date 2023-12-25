import { Box, alpha, styled } from '@mui/material';

const Container = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${(props) =>
    alpha(
      props.theme.palette.grey[
        props.theme.palette.mode === 'light' ? 200 : 600
      ],
      0.2,
    )};
`;

export { Container };
