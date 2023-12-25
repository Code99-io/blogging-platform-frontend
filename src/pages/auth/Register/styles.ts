import { Box, Button, styled } from '@mui/material';

const Container = styled(Box)`
  max-width: 550px;
  padding-left: ${(props) => props.theme.spacing(3)};
  padding-right: ${(props) => props.theme.spacing(3)};
  padding-top: 100px;
  padding-bottom: 100px;
  width: 100%;
`;

const FormWrapper = styled(Box)`
  margin-top: ${(props) => props.theme.spacing(1)};
`;

const RegisterButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing(3)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

export { Container, FormWrapper, RegisterButton };
