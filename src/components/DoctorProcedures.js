import React from 'react';
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
} from '@mui/material';

const formatPrice = (price) => {
  const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
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

const CheapestSurgeries = ({ surgeries }) => (
  <Box className='cheapest-surgeries' mb={4}>
    <Typography variant='h5' gutterBottom>
      Cheapest Surgeries
    </Typography>
    <TableContainer component={Paper}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Location</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Procedure</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {surgeries.map((surgery, index) => (
            <TableRow key={index}>
              <TableCell>{surgery.location}</TableCell>
              <TableCell>{surgery.doctor}</TableCell>
              <TableCell>{formatPrice(surgery.price.toString())}</TableCell>
              <TableCell>{surgery.procedure}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const DoctorProcedures = ({ data, selectedAreas, priceRange, gender }) => {
  const cheapestSurgeries = findCheapestSurgeries(data);

  return (
    <Box className='doctor-procedures'>
      <CheapestSurgeries surgeries={cheapestSurgeries} />
      <Typography variant='h4' gutterBottom>
        Available Doctors
      </Typography>
      {Object.entries(data).map(([doctorName, doctorData]) => (
        <Card key={doctorName} className='doctor-card'>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box className='doctor-info'>
                  <CardMedia
                    component='img'
                    image='https://placehold.co/200x200'
                    alt={`${doctorName} placeholder`}
                    className='doctor-image'
                  />
                  <Box className='doctor-details'>
                    <Typography variant='h5' gutterBottom>
                      {doctorName}
                    </Typography>
                    <Typography variant='subtitle1' color='text.secondary' gutterBottom>
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
                      <Card className='procedure-card'>
                        <Typography variant='h6' className='procedure-title'>
                          {area}
                        </Typography>
                        <Box className='procedure-list'>
                          {doctorData.Procedures[area] && Object.entries(doctorData.Procedures[area]).length > 0 ? (
                            Object.entries(doctorData.Procedures[area]).map(([procedure, price]) => (
                              <Typography key={procedure} variant='body2' className='procedure-item'>
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
