import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  OutlinedInput,
  Card,
  CardContent,
} from '@mui/material';

const InteractiveRecommendationForm = ({ data }) => {
  const [gender, setGender] = useState('');
  const [bodyArea, setBodyArea] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);

  const bodyAreas = useMemo(() => ['Face', 'Breast', 'Body'], []);

  const procedures = useMemo(() => {
    if (!bodyArea) return [];
    const allProcedures = new Set();
    Object.values(data).forEach((doctor) => {
      Object.keys(doctor.Procedures[bodyArea] || {}).forEach((procedure) => {
        allProcedures.add(procedure);
      });
    });
    return Array.from(allProcedures);
  }, [data, bodyArea]);

  const availableLocations = useMemo(() => {
    if (!selectedProcedure) return [];
    const locations = new Set();
    Object.values(data).forEach((doctor) => {
      if (doctor.Procedures[bodyArea]?.[selectedProcedure]) {
        locations.add(doctor.Location);
      }
    });
    return Array.from(locations);
  }, [data, bodyArea, selectedProcedure]);

  const availableDoctors = useMemo(() => {
    if (!selectedProcedure || !selectedLocation) return [];
    return Object.keys(data).filter(
      (doctorName) =>
        data[doctorName].Location === selectedLocation &&
        data[doctorName].Procedures[bodyArea]?.[selectedProcedure] &&
        data[doctorName].Procedures[bodyArea][selectedProcedure] >= priceRange[0] &&
        data[doctorName].Procedures[bodyArea][selectedProcedure] <= priceRange[1]
    );
  }, [data, bodyArea, selectedProcedure, selectedLocation, priceRange]);

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleBodyAreaChange = (event) => {
    setBodyArea(event.target.value);
    setSelectedProcedure('');
    setSelectedLocation('');
  };

  const handleProcedureChange = (event) => {
    setSelectedProcedure(event.target.value);
    setSelectedLocation('');
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const maxPrice = useMemo(() => {
    let max = 0;
    Object.values(data).forEach((doctor) => {
      Object.values(doctor.Procedures).forEach((area) => {
        Object.values(area).forEach((price) => {
          if (price > max) max = price;
        });
      });
    });
    return max;
  }, [data]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* First Column */}
        <Grid item xs={12} md={4}>
          <Typography variant='h6' gutterBottom>
            Select Options
          </Typography>
          <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
            <InputLabel id='gender-select-label'>Gender</InputLabel>
            <Select
              labelId='gender-select-label'
              id='gender-select'
              name='gender'
              value={gender}
              onChange={handleGenderChange}
              input={<OutlinedInput label='Gender' />}
              aria-label='Select Gender'
            >
              <MenuItem value=''>
                <em>Select Gender</em>
              </MenuItem>
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
            <InputLabel id='body-area-select-label'>Body Area</InputLabel>
            <Select
              labelId='body-area-select-label'
              id='body-area-select'
              name='bodyArea'
              value={bodyArea}
              onChange={handleBodyAreaChange}
              input={<OutlinedInput label='Body Area' />}
              aria-label='Select Body Area'
            >
              <MenuItem value=''>
                <em>Select Body Area</em>
              </MenuItem>
              {bodyAreas.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Second Column */}
        <Grid item xs={12} md={4}>
          <Typography variant='h6' gutterBottom>
            Select Procedure
          </Typography>
          <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
            <InputLabel id='procedure-select-label'>Procedure</InputLabel>
            <Select
              labelId='procedure-select-label'
              id='procedure-select'
              name='procedure'
              value={selectedProcedure}
              onChange={handleProcedureChange}
              disabled={!bodyArea || procedures.length === 0}
              input={<OutlinedInput label='Procedure' />}
              aria-label='Select Procedure'
            >
              <MenuItem value=''>
                <em>Select Procedure</em>
              </MenuItem>
              {procedures.map((procedure) => (
                <MenuItem key={procedure} value={procedure}>
                  {procedure}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
            <InputLabel id='location-select-label'>Location</InputLabel>
            <Select
              labelId='location-select-label'
              id='location-select'
              name='location'
              value={selectedLocation}
              onChange={handleLocationChange}
              disabled={!selectedProcedure || availableLocations.length === 0}
              input={<OutlinedInput label='Location' />}
              aria-label='Select Location'
            >
              <MenuItem value=''>
                <em>Select Location</em>
              </MenuItem>
              {availableLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Third Column */}
        <Grid item xs={12} md={4}>
          <Typography variant='h6' gutterBottom>
            Price Range
          </Typography>
          <Slider
            id='price-range-slider'
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay='auto'
            min={0}
            max={maxPrice}
            step={100}
            aria-labelledby='price-range-slider-label'
          />
          <Typography id='price-range-slider-label'>
            ${priceRange[0]} - ${priceRange[1]}
          </Typography>
        </Grid>
      </Grid>

      {/* Display available doctors */}
      {selectedLocation && availableDoctors.length > 0 && (
        <Box mt={4}>
          <Typography variant='h5' gutterBottom>
            Available Doctors
          </Typography>
          <Grid container spacing={2}>
            {availableDoctors.map((doctorName) => (
              <Grid item xs={12} sm={6} md={4} key={doctorName}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>{doctorName}</Typography>
                    <Typography>Location: {data[doctorName].Location}</Typography>
                    <Typography>Price: ${data[doctorName].Procedures[bodyArea][selectedProcedure]}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Alert for no available procedures */}
      {!bodyArea && (
        <Alert severity='info' sx={{ mt: 3 }}>
          Please select a body area to see available procedures.
        </Alert>
      )}
      {bodyArea && procedures.length === 0 && (
        <Alert severity='warning' sx={{ mt: 3 }}>
          No procedures available for the selected body area.
        </Alert>
      )}
      {selectedProcedure && availableLocations.length === 0 && (
        <Alert severity='warning' sx={{ mt: 3 }}>
          No locations available for the selected procedure.
        </Alert>
      )}
      {selectedLocation && availableDoctors.length === 0 && (
        <Alert severity='warning' sx={{ mt: 3 }}>
          No doctors available for the selected procedure and location within the specified price range.
        </Alert>
      )}
    </Box>
  );
};

export default InteractiveRecommendationForm;
