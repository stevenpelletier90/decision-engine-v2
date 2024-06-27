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
} from '@mui/material';

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
    <Box className='cheapest-surgeries' mb={4}>
      <Typography variant='h5' gutterBottom>
        Cheapest Surgeries
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
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSurgeries.map((surgery, index) => (
              <TableRow key={index}>
                <TableCell>{surgery.location}</TableCell>
                <TableCell>{surgery.doctor}</TableCell>
                <TableCell>{formatPrice(surgery.price)}</TableCell>
                <TableCell>{surgery.procedure}</TableCell>
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

  return (
    <Box className='doctor-procedures' sx={{ maxWidth: '1140px', margin: '0 auto', padding: '24px' }}>
      <CheapestSurgeries surgeries={cheapestSurgeries} />
      <Typography variant='h4' gutterBottom sx={{ mt: 4, mb: 3 }}>
        Available Doctors
      </Typography>
      {Object.entries(data).map(([doctorName, doctorData]) => (
        <Card key={doctorName} className='doctor-card' sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box className='doctor-info'>
                  <CardMedia
                    component='img'
                    image='https://placehold.co/200x200'
                    alt={`${doctorName} placeholder`}
                    className='doctor-image'
                    sx={{ width: '100%', height: 'auto', maxWidth: 200, maxHeight: 200, borderRadius: 1 }}
                  />
                  <Box className='doctor-details' sx={{ mt: 2 }}>
                    <Typography variant='h6' gutterBottom>
                      {doctorName}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' gutterBottom>
                      Location: {doctorData.Location}
                    </Typography>
                    <Link href='#' underline='hover'>
                      View Bio
                    </Link>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  {selectedAreas.map((area) => (
                    <Grid item xs={12} sm={6} md={4} key={area}>
                      <Card className='procedure-card' sx={{ height: '100%' }}>
                        <Typography
                          variant='h6'
                          className='procedure-title'
                          sx={{ p: 1, bgcolor: 'primary.main', color: 'white' }}
                        >
                          {area}
                        </Typography>
                        <Box className='procedure-list' sx={{ p: 2 }}>
                          {doctorData.Procedures[area] && Object.entries(doctorData.Procedures[area]).length > 0 ? (
                            Object.entries(doctorData.Procedures[area]).map(([procedure, price]) => (
                              <Typography
                                key={procedure}
                                variant='body2'
                                className='procedure-item'
                                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                              >
                                <span>{procedure}</span>
                                <strong>{formatPrice(price)}</strong>
                              </Typography>
                            ))
                          ) : (
                            <Typography variant='body2' color='text.secondary'>
                              No procedures available in this price range.
                            </Typography>
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DoctorProcedures;
