import React from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';

const DoctorProcedures = ({ data }) => {
  return (
    <div>
      <Typography variant='h4' gutterBottom>
        Doctor Procedures and Prices
      </Typography>
      {Object.keys(data).map((doctor) => (
        <Card key={doctor} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant='h5'>{doctor}</Typography>
            <Typography variant='subtitle1' color='text.secondary'>
              Location: {data[doctor].Location}
            </Typography>
            <Typography variant='h6' sx={{ mt: 2 }}>
              Procedures:
            </Typography>
            <List>
              {Object.entries(data[doctor].Procedures).map(([procedure, price], index) => (
                <React.Fragment key={procedure}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText primary={procedure} secondary={`$${price}`} />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorProcedures;
