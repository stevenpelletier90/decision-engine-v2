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
import MaleSVG from '../assets/images/male-body.svg';
import MaleBodyGoldSVG from '../assets/images/male-body-gold.svg';
import FemaleSVG from '../assets/images/female.svg';
import FemaleArmsSVG from '../assets/images/Female-Arms.svg';
import FemaleBackSVG from '../assets/images/Female-Back.svg';
import FemaleBreastSVG from '../assets/images/Female-Breast.svg';
import FemaleButtocksSVG from '../assets/images/Female-Buttocks.svg';
import FemaleFaceSVG from '../assets/images/Female-Face.svg';
import FemaleLegsSVG from '../assets/images/Female-Legs.svg';
import FemaleStomachSVG from '../assets/images/Female-Stomach.svg';

import '../styles/index.scss';

const bodyAreaSVGs = {
  Female: {
    Arms: FemaleArmsSVG,
    Back: FemaleBackSVG,
    Breast: FemaleBreastSVG,
    Buttocks: FemaleButtocksSVG,
    Face: FemaleFaceSVG,
    Legs: FemaleLegsSVG,
    Stomach: FemaleStomachSVG,
  },
};

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

  const bodyAreaOptions = ['Face/Neck/Eyes', 'Breast', 'Arms', 'Legs', 'Stomach/Waist', 'Back', 'Buttocks'];

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
                <Box className='svg-container'>
                  <InteractiveSVG
                    gender={gender}
                    selectedAreas={bodyAreas}
                    onAreaClick={handleAreaClick}
                    bodyAreaOptions={bodyAreaOptions}
                  />
                </Box>
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
                {gender && (
                  <Grid item xs={12}>
                    <Typography variant='h6' gutterBottom>
                      Select Body Areas (Max 3)
                    </Typography>
                    {showWarning && (
                      <Alert severity='warning' sx={{ mt: 2 }}>
                        You can select a maximum of 3 body areas.
                      </Alert>
                    )}
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

const InteractiveSVG = ({ gender, selectedAreas, onAreaClick, bodyAreaOptions }) => {
  const baseSVG = gender === 'Female' ? FemaleSVG : MaleSVG;
  const goldSVG = gender === 'Female' ? null : MaleBodyGoldSVG;

  const getAreaId = (area) => {
    switch (area) {
      case 'Face/Neck/Eyes':
        return 'Head';
      case 'Breast':
        return 'Chest';
      case 'Stomach/Waist':
        return 'Stomach';
      default:
        return area;
    }
  };

  return (
    <Box className='svg-wrapper'>
      <svg width='100%' height='100%' viewBox='0 0 238 509.1'>
        <image href={baseSVG} width='100%' height='100%' />
        {gender === 'Male' ? (
          <g>
            {bodyAreaOptions.map((area) => (
              <use
                key={area}
                href={`${goldSVG}#${getAreaId(area)}`}
                className={`area-use ${selectedAreas.includes(area) ? 'selected' : ''}`}
                onClick={() => onAreaClick(area)}
              />
            ))}
          </g>
        ) : (
          bodyAreaOptions.map((area) => {
            const areaSVG =
              bodyAreaSVGs[gender][area === 'Face/Neck/Eyes' ? 'Face' : area === 'Stomach/Waist' ? 'Stomach' : area];
            if (!areaSVG) return null;
            return (
              <image
                key={area}
                href={areaSVG}
                className={`area-svg ${selectedAreas.includes(area) ? 'selected' : ''}`}
                onClick={() => onAreaClick(area)}
              />
            );
          })
        )}
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
