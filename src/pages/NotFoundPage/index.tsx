import { Box, Button, Container, Typography } from '@mui/material';
import { appRoutes } from '../../constants';

export interface NotFoundPageProps {
  title: string;
  subTitle?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ title, subTitle }) => {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
      }}
      maxWidth={'sm'}
    >
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {subTitle && <Typography variant="body1">{subTitle}</Typography>}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => (window.location.href = appRoutes.HOME)}
        >
          Go to Home Page
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
