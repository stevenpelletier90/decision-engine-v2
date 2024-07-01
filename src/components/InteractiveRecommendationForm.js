import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Slider,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DoctorProcedures from './DoctorProcedures';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const InteractiveRecommendationForm = ({ data }) => {
  const [gender, setGender] = useState('');
  const [bodyAreas, setBodyAreas] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showGenderError, setShowGenderError] = useState(false);
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
    setShowGenderError(false);
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
    if (!gender) {
      setShowGenderError(true);
      return;
    }
    setShowResults(true);
  };

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' gutterBottom align='center' sx={{ my: 4 }}>
        Find Your Ideal Procedure
      </Typography>
      <StyledPaper elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledFormControl fullWidth>
              <InputLabel id='gender-select-label'>Gender</InputLabel>
              <Select
                labelId='gender-select-label'
                id='gender-select'
                value={gender}
                onChange={handleGenderChange}
                label='Gender'
              >
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
              </Select>
            </StyledFormControl>
            {showGenderError && (
              <Alert severity='error' sx={{ mb: 2 }}>
                Please select a gender before proceeding.
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledFormControl fullWidth>
              <InputLabel id='body-area-select-label'>Body Area (Max 3)</InputLabel>
              <Select
                labelId='body-area-select-label'
                id='body-area-select'
                multiple
                value={bodyAreas}
                onChange={handleBodyAreaChange}
                label='Body Area (Max 3)'
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map((value) => (
                      <StyledChip key={value} label={value} />
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
            </StyledFormControl>
            {showWarning && (
              <Alert severity='warning' sx={{ mb: 2 }}>
                You can select a maximum of 3 body areas.
              </Alert>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Ideal Budget
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay='auto'
              min={minPrice}
              max={maxPrice}
              step={100}
              valueLabelFormat={(value) => `$${value}`}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2'>${priceRange[0]}</Typography>
              <Typography variant='body2'>${priceRange[1]}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' color='primary' onClick={handleSubmit} fullWidth>
              Find Matching Procedures
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      {showResults && (
        <Box sx={{ mt: 4 }}>
          {Object.keys(filteredData).length > 0 ? (
            <DoctorProcedures data={filteredData} selectedAreas={bodyAreas} priceRange={priceRange} gender={gender} />
          ) : (
            <Alert severity='info'>No doctors available for the selected criteria.</Alert>
          )}
        </Box>
      )}
    </Container>
  );
};

export default InteractiveRecommendationForm;
