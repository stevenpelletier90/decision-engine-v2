import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
} from '@mui/material';

const RecommendationForm = ({ data }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [procedure, setProcedure] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Data:', data);
    console.log('Form values:', { age, gender, location, procedure });

    // Enhanced logic to determine the best recommendation
    const recommendedDoctors = Object.keys(data).filter((doctor) => {
      const doctorData = data[doctor];
      return doctorData.Location === location && doctorData.Procedures[procedure];
    });

    console.log('Recommended doctors:', recommendedDoctors);

    if (recommendedDoctors.length > 0) {
      // Sort doctors by price (assuming lower price is better)
      const sortedDoctors = recommendedDoctors.sort(
        (a, b) => data[a].Procedures[procedure] - data[b].Procedures[procedure]
      );

      console.log('Sorted doctors:', sortedDoctors);

      setRecommendation({
        doctor: sortedDoctors[0],
        location: data[sortedDoctors[0]].Location,
        procedure,
        price: data[sortedDoctors[0]].Procedures[procedure],
      });
    } else {
      console.log('No recommendation found');
      setRecommendation(null);
    }
  };

  // Rest of the component remains the same
  // ...

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      {/* Form JSX remains the same */}
      {/* ... */}
      {recommendation && (
        <Box mt={4}>
          <Typography variant='h5' gutterBottom>
            Recommended Doctor and Procedure
          </Typography>
          <Typography>Doctor: {recommendation.doctor}</Typography>
          <Typography>Location: {recommendation.location}</Typography>
          <Typography>Procedure: {recommendation.procedure}</Typography>
          <Typography>Price: ${recommendation.price}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RecommendationForm;
