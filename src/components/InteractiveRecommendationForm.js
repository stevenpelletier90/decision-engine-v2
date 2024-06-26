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
  OutlinedInput,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import DoctorProcedures from './DoctorProcedures';

const InteractiveRecommendationForm = ({ data }) => {
  const [gender, setGender] = useState('');
  const [bodyAreas, setBodyAreas] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const bodyAreaOptions = ['Face/Neck/Eyes', 'Breast', 'Arms', 'Legs', 'Stomach/Waist', 'Back', 'Buttocks'];

  const { maxPrice, minPrice } = useMemo(() => {
    let max = 0;
    let min = Infinity;
    Object.values(data).forEach((doctor) => {
      Object.values(doctor.Procedures).forEach((bodyArea) => {
        Object.values(bodyArea).forEach((genderProcedures) => {
          Object.values(genderProcedures).forEach((price) => {
            const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
            if (numericPrice > max) max = numericPrice;
            if (numericPrice < min) min = numericPrice;
          });
        });
      });
    });
    return {
      maxPrice: Math.ceil(max / 1000) * 1000,
      minPrice: Math.floor(min / 1000) * 1000,
    };
  }, [data]);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const filteredData = useMemo(() => {
    if (!showResults || !gender || bodyAreas.length === 0) return {};
    return Object.entries(data).reduce((acc, [doctorName, doctorData]) => {
      const relevantProcedures = {};
      bodyAreas.forEach((area) => {
        if (doctorData.Procedures[area] && doctorData.Procedures[area][gender]) {
          relevantProcedures[area] = Object.entries(doctorData.Procedures[area][gender])
            .filter(([_, price]) => {
              const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
              return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
            })
            .reduce((obj, [procedure, price]) => {
              obj[procedure] = price;
              return obj;
            }, {});
        }
      });
      if (Object.keys(relevantProcedures).length > 0) {
        acc[doctorName] = {
          ...doctorData,
          Procedures: relevantProcedures,
        };
      }
      return acc;
    }, {});
  }, [data, gender, bodyAreas, priceRange, showResults]);

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleBodyAreaChange = (event) => {
    const selectedAreas = event.target.value;
    if (selectedAreas.length <= 3) {
      setBodyAreas(selectedAreas);
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant='h6' gutterBottom>
            Select Options
          </Typography>
          <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
            <InputLabel id='gender-select-label'>Gender</InputLabel>
            <Select
              labelId='gender-select-label'
              id='gender-select'
              value={gender}
              onChange={handleGenderChange}
              input={<OutlinedInput label='Gender' />}
            >
              <MenuItem value='Male'>Male</MenuItem>
              <MenuItem value='Female'>Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant='outlined' fullWidth sx={{ mb: 2 }}>
            <InputLabel id='body-area-select-label'>Body Area (Max 3)</InputLabel>
            <Select
              labelId='body-area-select-label'
              id='body-area-select'
              multiple
              value={bodyAreas}
              onChange={handleBodyAreaChange}
              input={<OutlinedInput label='Body Area (Max 3)' />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {bodyAreaOptions.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {showWarning && (
            <Alert severity='warning' sx={{ mb: 2 }}>
              You can select a maximum of 3 body areas.
            </Alert>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='h6' gutterBottom>
            Price Range
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay='auto'
            min={minPrice}
            max={maxPrice}
            step={100}
          />
          <Typography>
            ${priceRange[0]} - ${priceRange[1]}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={3} display='flex' justifyContent='center'>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Submit
        </Button>
      </Box>

      {showResults && (
        <Box mt={4}>
          {Object.keys(filteredData).length > 0 ? (
            <DoctorProcedures data={filteredData} selectedAreas={bodyAreas} priceRange={priceRange} gender={gender} />
          ) : (
            <Alert severity='info' sx={{ mt: 3 }}>
              No doctors available for the selected criteria.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default InteractiveRecommendationForm;
