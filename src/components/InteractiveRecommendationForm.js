import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Slider,
  Button,
  Alert,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DoctorProcedures from './DoctorProcedures';

// SVG imports
import MaleFrontSVG from '../assets/images/male-front.svg';
import MaleBackSVG from '../assets/images/male-back.svg';
import MaleGoldFrontSVG from '../assets/images/male-gold-front.svg';
import MaleGoldBackSVG from '../assets/images/male-gold-back.svg';
import FemaleFrontSVG from '../assets/images/female-front.svg';
import FemaleBackSVG from '../assets/images/female-back.svg';
import FemaleGoldFrontSVG from '../assets/images/female-gold-front.svg';
import FemaleGoldBackSVG from '../assets/images/female-gold-back.svg';

import '../styles/index.scss';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  palette: {
    primary: { main: '#1b1b1b' },
    secondary: { main: '#c8b273' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '1px',
          borderRadius: 0,
        },
      },
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#f5f5f5',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  '&:hover': { backgroundColor: theme.palette.secondary.dark },
  margin: theme.spacing(1),
}));

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const FlexItem = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
}));

const bodyAreaOptions = {
  front: {
    Male: ['Face/Neck/Eyes', 'Chest', 'Arms', 'Stomach/Waist', 'Legs'],
    Female: ['Face/Neck/Eyes', 'Breast', 'Arms', 'Stomach/Waist', 'Legs'],
  },
  back: {
    Male: ['Back', 'Buttocks', 'Arms', 'Legs'],
    Female: ['Back', 'Buttocks', 'Arms', 'Legs'],
  },
};

const InteractiveRecommendationForm = ({ data }) => {
  const { maxPrice, minPrice } = useMemo(() => {
    let max = 0,
      min = Infinity;
    Object.values(data).forEach((doctor) => {
      Object.values(doctor.Procedures).forEach((bodyArea) => {
        Object.values(bodyArea).forEach((genderProcedures) => {
          Object.values(genderProcedures).forEach((price) => {
            const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
            max = Math.max(max, numericPrice);
            min = Math.min(min, numericPrice);
          });
        });
      });
    });
    return {
      maxPrice: Math.ceil(max / 1000) * 1000,
      minPrice: Math.floor(min / 1000) * 1000,
    };
  }, [data]);

  const [gender, setGender] = useState('');
  const [bodyAreas, setBodyAreas] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [view, setView] = useState('front');

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
            .reduce((obj, [procedure, price]) => ({ ...obj, [procedure]: price }), {});
        }
      });
      if (Object.keys(relevantProcedures).length > 0) {
        acc[doctorName] = { ...doctorData, Procedures: relevantProcedures };
      }
      return acc;
    }, {});
  }, [data, gender, bodyAreas, priceRange, showResults]);

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setBodyAreas([]);
  };

  const handleAreaClick = (area) => {
    setBodyAreas((prev) => {
      if (prev.includes(area)) return prev.filter((a) => a !== area);
      if (prev.length < 3) return [...prev, area];
      setShowWarning(true);
      return prev;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg'>
        <Typography variant='h4' gutterBottom align='center' className='page-title'>
          Find Your Ideal Procedure
        </Typography>

        <StyledPaper elevation={3}>
          <FlexContainer>
            <FlexItem>
              {gender && (
                <>
                  <Box className='svg-container'>
                    <InteractiveSVG
                      gender={gender}
                      selectedAreas={bodyAreas}
                      onAreaClick={handleAreaClick}
                      view={view}
                    />
                  </Box>
                  <Box display='flex' justifyContent='center' mt={2}>
                    <StyledButton
                      onClick={() => setView('front')}
                      variant={view === 'front' ? 'contained' : 'outlined'}
                    >
                      Front View
                    </StyledButton>
                    <StyledButton onClick={() => setView('back')} variant={view === 'back' ? 'contained' : 'outlined'}>
                      Back View
                    </StyledButton>
                  </Box>
                </>
              )}
            </FlexItem>
            <FlexItem>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box display='flex' justifyContent='center'>
                    <StyledButton
                      onClick={() => handleGenderChange('Male')}
                      variant={gender === 'Male' ? 'contained' : 'outlined'}
                    >
                      Male
                    </StyledButton>
                    <StyledButton
                      onClick={() => handleGenderChange('Female')}
                      variant={gender === 'Female' ? 'contained' : 'outlined'}
                    >
                      Female
                    </StyledButton>
                  </Box>
                </Grid>
                {showWarning && (
                  <Grid item xs={12}>
                    <Alert severity='warning' sx={{ mt: 2 }}>
                      You can select a maximum of 3 body areas.
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant='h6' gutterBottom>
                    Ideal Budget
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue)}
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
                  <StyledButton
                    variant='contained'
                    onClick={() => gender && bodyAreas.length > 0 && setShowResults(true)}
                    fullWidth
                  >
                    Find Matching Procedures
                  </StyledButton>
                </Grid>
              </Grid>
            </FlexItem>
          </FlexContainer>
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
    </ThemeProvider>
  );
};

const InteractiveSVG = ({ gender, selectedAreas, onAreaClick, view }) => {
  const baseSVG =
    gender === 'Female'
      ? view === 'front'
        ? FemaleFrontSVG
        : FemaleBackSVG
      : view === 'front'
      ? MaleFrontSVG
      : MaleBackSVG;

  const goldSVG =
    gender === 'Female'
      ? view === 'front'
        ? FemaleGoldFrontSVG
        : FemaleGoldBackSVG
      : view === 'front'
      ? MaleGoldFrontSVG
      : MaleGoldBackSVG;

  const getAreaId = (area) => {
    switch (area) {
      case 'Face/Neck/Eyes':
        return 'Head';
      case 'Chest':
        return gender === 'Male' ? 'Chest' : 'Breast';
      case 'Breast':
        return 'Breast';
      case 'Stomach/Waist':
        return 'Abdomen';
      default:
        return area;
    }
  };

  return (
    <Box className='svg-wrapper'>
      <svg width='100%' height='100%' viewBox='0 0 524.4 840'>
        <image href={baseSVG} width='100%' height='100%' />
        <g>
          {bodyAreaOptions[view][gender].map((area) => (
            <use
              key={area}
              href={`${goldSVG}#${getAreaId(area)}`}
              className={`area-use ${selectedAreas.includes(area) ? 'selected' : ''}`}
              onClick={() => onAreaClick(area)}
            />
          ))}
        </g>
      </svg>
      <Box className='selected-areas'>
        {selectedAreas.length > 0 ? (
          selectedAreas.map((area) => (
            <Box key={area} className='selected-area-tag'>
              {area}
            </Box>
          ))
        ) : (
          <Typography variant='body2'>No areas selected</Typography>
        )}
      </Box>
    </Box>
  );
};

export default InteractiveRecommendationForm;
