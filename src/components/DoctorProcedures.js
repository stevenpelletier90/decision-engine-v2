import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const DoctorProcedures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/doctor_procedures.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity='error'>Error fetching data: {error.message}</Alert>;
  }

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
