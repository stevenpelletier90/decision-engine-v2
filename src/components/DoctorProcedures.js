import React from 'react';
import { Typography, Card, CardContent, CardMedia, Grid, Link, Box, Divider } from '@mui/material';

const DoctorProcedures = ({ data, selectedAreas, priceRange, gender }) => {
  return (
    <Box className='doctor-procedures'>
      <Typography variant='h4' gutterBottom>
        Available Doctors
      </Typography>
      {Object.entries(data).map(([doctorName, doctorData]) => (
        <Card key={doctorName} className='doctor-card'>
          <CardContent>
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
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {selectedAreas.map((area) => (
                <Grid item xs={12} sm={6} md={4} key={area}>
                  <Card className='procedure-card'>
                    <Typography variant='h6' className='procedure-title'>
                      {area}
                    </Typography>
                    <Box className='procedure-list'>
                      {doctorData.Procedures[area] && Object.entries(doctorData.Procedures[area]).length > 0 ? (
                        Object.entries(doctorData.Procedures[area])
                          .filter(([procedure]) => procedure.includes(gender) || !procedure.includes('Male'))
                          .map(([procedure, price]) => (
                            <Typography key={procedure} variant='body2' className='procedure-item'>
                              <span>{procedure}</span>
                              <strong>{price}</strong>
                            </Typography>
                          ))
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          No procedures available for this area.
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DoctorProcedures;
