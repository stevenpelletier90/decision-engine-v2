import React, { useState, useMemo } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import '../styles/index.css';

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h5: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h6: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  palette: {
    primary: {
      main: '#1b1b1b',
    },
    secondary: {
      main: '#c8b273',
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: '75%',
  borderRadius: '50%',
  margin: theme.spacing(2),
}));

const ProcedureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
}));

const ProcedureTitle = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1),
}));

const ProcedureList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const ProcedureItem = styled(Typography)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const formatPrice = (price) => {
  const numericPrice = typeof price === 'number' ? price : parseFloat(price.replace('$', '').replace(',', ''));
  return `$${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const findCheapestSurgeries = (data) => {
  const cheapestSurgeries = [];
  Object.entries(data).forEach(([doctorName, doctorData]) => {
    Object.entries(doctorData.Procedures).forEach(([area, procedures]) => {
      Object.entries(procedures).forEach(([procedure, price]) => {
        const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
        const existingIndex = cheapestSurgeries.findIndex((s) => s.procedure === procedure);
        if (existingIndex === -1 || numericPrice < cheapestSurgeries[existingIndex].price) {
          const surgeryInfo = {
            location: doctorData.Location,
            doctor: doctorName,
            price: numericPrice,
            procedure: procedure,
          };
          if (existingIndex === -1) {
            cheapestSurgeries.push(surgeryInfo);
          } else {
            cheapestSurgeries[existingIndex] = surgeryInfo;
          }
        }
      });
    });
  });
  return cheapestSurgeries;
};

const CheapestSurgeries = ({ surgeries }) => {
  const [orderBy, setOrderBy] = useState('price');
  const [order, setOrder] = useState('asc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedSurgeries = useMemo(() => {
    const comparator = (a, b) => {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    };

    return [...surgeries].sort((a, b) => {
      return order === 'desc' ? comparator(a, b) : -comparator(a, b);
    });
  }, [surgeries, order, orderBy]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant='h5' gutterBottom>
        Your Procedure Results
      </Typography>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={orderBy === 'location' ? order : 'asc'}
                  onClick={() => handleRequestSort('location')}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'doctor'}
                  direction={orderBy === 'doctor' ? order : 'asc'}
                  onClick={() => handleRequestSort('doctor')}
                >
                  Doctor
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'procedure'}
                  direction={orderBy === 'procedure' ? order : 'asc'}
                  onClick={() => handleRequestSort('procedure')}
                >
                  Procedure
                </TableSortLabel>
              </TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSurgeries.map((surgery, index) => (
              <TableRow key={index}>
                <TableCell>{surgery.location}</TableCell>
                <TableCell>{surgery.doctor}</TableCell>
                <TableCell>{surgery.procedure}</TableCell>
                <TableCell>
                  <StyledButton
                    variant='contained'
                    size='small'
                    onClick={() => {
                      // Placeholder for future popup functionality
                      console.log(`Show price details for ${surgery.procedure}`);
                    }}
                  >
                    View Price
                  </StyledButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DoctorProcedures = ({ data, selectedAreas, priceRange, gender }) => {
  const cheapestSurgeries = findCheapestSurgeries(data);

  const getDoctorImage = (doctorData) => {
    if (doctorData.Image) {
      return require(`../assets/images/${doctorData.Image}`);
    }
    return 'https://placehold.co/200x200';
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <CheapestSurgeries surgeries={cheapestSurgeries} />
        <Typography variant='h4' gutterBottom sx={{ color: theme.palette.primary.main }}>
          Available Doctors
        </Typography>
        <Grid container spacing={4}>
          {Object.entries(data).map(([doctorName, doctorData]) => (
            <Grid item xs={12} key={doctorName}>
              <StyledCard>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <StyledCardMedia
                          image={getDoctorImage(doctorData)}
                          title={doctorName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/200x200';
                          }}
                        />
                        <Typography variant='h6' gutterBottom>
                          {doctorName}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' gutterBottom>
                          Location:{' '}
                          {doctorData.LocationUrl ? (
                            <Link href={doctorData.LocationUrl} target='_blank' rel='noopener noreferrer'>
                              {doctorData.Location}
                            </Link>
                          ) : (
                            doctorData.Location
                          )}
                        </Typography>
                        {doctorData.BioUrl && (
                          <Link href={doctorData.BioUrl} target='_blank' rel='noopener noreferrer'>
                            View Bio
                          </Link>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Grid container spacing={2}>
                        {selectedAreas.map((area) => (
                          <Grid item xs={12} sm={6} md={4} key={area}>
                            <ProcedureCard>
                              <ProcedureTitle variant='h6'>{area}</ProcedureTitle>
                              <ProcedureList>
                                {doctorData.Procedures[area] &&
                                Object.entries(doctorData.Procedures[area]).length > 0 ? (
                                  Object.entries(doctorData.Procedures[area]).map(([procedure, price]) => (
                                    <ProcedureItem key={procedure} variant='body2'>
                                      <span>{procedure}</span>
                                      <strong>{formatPrice(price)}</strong>
                                    </ProcedureItem>
                                  ))
                                ) : (
                                  <Typography variant='body2' color='text.secondary'>
                                    No procedures available in this price range.
                                  </Typography>
                                )}
                              </ProcedureList>
                            </ProcedureCard>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default DoctorProcedures;
