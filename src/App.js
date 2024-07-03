import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InteractiveRecommendationForm from './components/InteractiveRecommendationForm';

const theme = createTheme();

const App = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrl =
      process.env.NODE_ENV === 'production' ? '/decision-engine-v2/doctor_procedures.json' : '/doctor_procedures.json';

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((fetchedData) => {
        console.log('Fetched data:', fetchedData);
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth='lg'>
        <Typography variant='h2' component='h1' gutterBottom align='center' sx={{ mt: 4 }}>
          Interactive Procedure Finder
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity='error'>Error fetching data: {error.message}</Alert>
        ) : (
          <InteractiveRecommendationForm data={data} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
