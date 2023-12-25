import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppRoutes from './routes/AppRoutes';
import { SnackbarProvider } from 'notistack';
import { ErrorBoundary } from 'react-error-boundary';
import { NotFoundPage } from './pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const theme = createTheme();

const App = (): React.ReactElement => {
  return (
    <ErrorBoundary
      fallback={
        <NotFoundPage
          title="Uh oh, Something went wrong."
          subTitle="We are working on getting things back to normal."
        />
      }
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SnackbarProvider
              maxSnack={3}
              autoHideDuration={1500}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            >
              <BrowserRouter>
                <CssBaseline />
                <AppRoutes />
              </BrowserRouter>
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
