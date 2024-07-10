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
  ThemeProvider,
  createTheme,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DoctorProcedures from './DoctorProcedures';
import FemaleSVG from '../assets/images/female.svg';
import MaleSVG from '../assets/images/male.svg';

// Male SVGs
import MaleArmsSVG from '../assets/images/Male-Arms.svg';
import MaleBackSVG from '../assets/images/Male-Back.svg';
import MaleButtocksSVG from '../assets/images/Male-Buttocks.svg';
import MaleBreastSVG from '../assets/images/Male-Chest.svg';
import MaleFaceSVG from '../assets/images/Male-Face.svg';
import MaleLegsSVG from '../assets/images/Male-Legs.svg';
import MaleStomachSVG from '../assets/images/Male-Stomach.svg';

// Female SVGs
import FemaleArmsSVG from '../assets/images/Female-Arms.svg';
import FemaleBackSVG from '../assets/images/Female-Back.svg';
import FemaleBreastSVG from '../assets/images/Female-Breast.svg';
import FemaleButtocksSVG from '../assets/images/Female-Buttocks.svg';
import FemaleFaceSVG from '../assets/images/Female-Face.svg';
import FemaleLegsSVG from '../assets/images/Female-Legs.svg';
import FemaleStomachSVG from '../assets/images/Female-Stomach.svg';

import '../styles/index.css';

// Create a mapping for body areas
const bodyAreaSVGs = {
  Male: {
    Arms: MaleArmsSVG,
    Back: MaleBackSVG,
    Buttocks: MaleButtocksSVG,
    Breast: MaleBreastSVG,
    Face: MaleFaceSVG,
    Legs: MaleLegsSVG,
    Stomach: MaleStomachSVG,
  },
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

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h6: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  palette: {
    primary: {
      main: '#1b1b1b',
    },
    secondary: {
      main: '#c8b273',
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#f5f5f5',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  margin: theme.spacing(1),
}));

const bodyAreaPositions = {
  Male: {
    Arms: { top: '20%', left: '5%', width: '90%', height: '40%' },
    Back: { top: '15%', left: '25%', width: '50%', height: '50%' },
    Buttocks: { top: '45%', left: '30%', width: '40%', height: '20%' },
    Breast: { top: '20%', left: '30%', width: '40%', height: '20%' },
    Face: { top: '2%', left: '35%', width: '30%', height: '15%' },
    Legs: { top: '50%', left: '25%', width: '50%', height: '48%' },
    Stomach: { top: '35%', left: '30%', width: '40%', height: '20%' },
  },
  Female: {
    Arms: { top: '20%', left: '5%', width: '90%', height: '40%' },
    Back: { top: '15%', left: '25%', width: '50%', height: '50%' },
    Breast: { top: '25%', left: '30%', width: '40%', height: '15%' },
    Buttocks: { top: '45%', left: '30%', width: '40%', height: '20%' },
    Face: { top: '2%', left: '35%', width: '30%', height: '15%' },
    Legs: { top: '50%', left: '25%', width: '50%', height: '48%' },
    Stomach: { top: '35%', left: '30%', width: '40%', height: '20%' },
  },
};

const InteractiveRecommendationForm = ({ data }) => {
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

  const [gender, setGender] = useState('');
  const [bodyAreas, setBodyAreas] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showGenderError, setShowGenderError] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hoveredArea, setHoveredArea] = useState(null);
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
    setBodyAreas([]);
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

  const handleAreaClick = (area) => {
    setBodyAreas((prev) => {
      if (prev.includes(area)) {
        return prev.filter((a) => a !== area);
      }
      if (prev.length < 3) {
        return [...prev, area];
      }
      setShowWarning(true);
      return prev;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg'>
        <Typography variant='h4' gutterBottom align='center' sx={{ my: 4, color: theme.palette.primary.main }}>
          Find Your Ideal Procedure
        </Typography>

        <StyledPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                Select Your Gender
              </Typography>
              <Box display='flex' justifyContent='center'>
                <StyledButton
                  onClick={() => handleGenderChange({ target: { value: 'Male' } })}
                  variant={gender === 'Male' ? 'contained' : 'outlined'}
                >
                  Male
                </StyledButton>
                <StyledButton
                  onClick={() => handleGenderChange({ target: { value: 'Female' } })}
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
                <Box
                  sx={{
                    height: 500,
                    border: '1px solid #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <InteractiveSVG
                    svg={gender === 'Female' ? FemaleSVG : MaleSVG}
                    selectedAreas={bodyAreas}
                    onAreaClick={handleAreaClick}
                    bodyAreaOptions={bodyAreaOptions}
                    gender={gender}
                  />
                </Box>
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
              <StyledButton variant='contained' onClick={handleSubmit} fullWidth>
                Find Matching Procedures
              </StyledButton>
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
    </ThemeProvider>
  );
};

const InteractiveSVG = ({ svg, selectedAreas, onAreaClick, bodyAreaOptions, gender }) => {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        component='img'
        src={svg}
        alt={`${gender} body outline`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          userSelect: 'none',
        }}
      />
      {bodyAreaOptions.map((area) => {
        const areaSVG =
          bodyAreaSVGs[gender][area === 'Face/Neck/Eyes' ? 'Face' : area === 'Stomach/Waist' ? 'Stomach' : area];
        const position =
          bodyAreaPositions[gender][area === 'Face/Neck/Eyes' ? 'Face' : area === 'Stomach/Waist' ? 'Stomach' : area];
        if (!areaSVG || !position) return null;

        return (
          <Tooltip key={area} title={area} arrow>
            <Box
              sx={{
                position: 'absolute',
                ...position,
                cursor: 'pointer',
              }}
              onClick={() => onAreaClick(area)}
            >
              <Box
                component='img'
                src={areaSVG}
                alt={area}
                sx={{
                  width: '100%',
                  height: '100%',
                  opacity: selectedAreas.includes(area) ? 1 : 0.3,
                  transition: 'opacity 0.3s, transform 0.3s',
                  '&:hover': {
                    opacity: 0.7,
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Box>
          </Tooltip>
        );
      })}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
        }}
      >
        Selected Areas: {selectedAreas.join(', ')}
      </Box>
    </Box>
  );
};

export default InteractiveRecommendationForm;
