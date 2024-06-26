import React from 'react';
import { Typography, Card, CardContent, CardMedia, Grid, Link, Box } from '@mui/material';

const DoctorProcedures = ({ data, selectedAreas, priceRange, gender }) => {
  return (
    <div>
      <Typography variant='h4' gutterBottom>
        Available Doctors
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(data).map(([doctorName, doctorData]) => (
          <Grid item xs={12} key={doctorName}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={3}>
                    <CardMedia
                      component='img'
                      height='200'
                      image='/api/placeholder/300/200'
                      alt={`${doctorName} placeholder`}
                      sx={{ objectFit: 'cover', borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Typography variant='h5' gutterBottom>
                      {doctorName}
                    </Typography>
                    <Typography variant='subtitle1' color='text.secondary' gutterBottom>
                      Location: {doctorData.Location}
                    </Typography>
                    <Link href='#' underline='hover'>
                      View Bio
                    </Link>
                    <Grid container spacing={2} mt={1}>
                      {selectedAreas.map((area) => (
                        <Grid item xs={12} sm={6} md={4} key={area}>
                          <Card variant='outlined'>
                            <CardContent>
                              <Typography variant='h6' gutterBottom>
                                {area}
                              </Typography>
                              {doctorData.Procedures[area] && Object.entries(doctorData.Procedures[area]).length > 0 ? (
                                Object.entries(doctorData.Procedures[area]).map(([procedure, price]) => (
                                  <Typography key={procedure} variant='body2'>
                                    {procedure}: {price}
                                  </Typography>
                                ))
                              ) : (
                                <Typography variant='body2' color='text.secondary'>
                                  No procedures available for this area.
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DoctorProcedures;
