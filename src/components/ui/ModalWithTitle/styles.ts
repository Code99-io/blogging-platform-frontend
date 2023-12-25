import { Card, styled } from '@mui/material';

const Container = styled(Card)<{ $backgroundColor?: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  overflow: hidden;
`;

export { Container };
