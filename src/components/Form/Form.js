import React, { useState, useMemo, useEffect } from 'react';
import DoctorProcedures from '../Results/Results';
import MaleFrontSVG from '../../assets/images/male-front.svg';
import MaleBackSVG from '../../assets/images/male-back.svg';
import MaleGoldFrontSVG from '../../assets/images/male-gold-front.svg';
import MaleGoldBackSVG from '../../assets/images/male-gold-back.svg';
import FemaleFrontSVG from '../../assets/images/female-front.svg';
import FemaleBackSVG from '../../assets/images/female-back.svg';
import FemaleGoldFrontSVG from '../../assets/images/female-gold-front.svg';
import FemaleGoldBackSVG from '../../assets/images/female-gold-back.svg';
import './Form.module.css';

const bodyAreaOptions = {
  front: {
    Male: ['Face/Neck/Eyes', 'Chest', 'Arms', 'Stomach/Waist', 'Legs'],
    Female: ['Face/Neck/Eyes', 'Breast', 'Arms', 'Stomach/Waist', 'Legs'],
  },
  back: {
    Male: ['Face/Neck/Eyes', 'Back', 'Buttocks', 'Arms', 'Legs'],
    Female: ['Face/Neck/Eyes', 'Back', 'Buttocks', 'Arms', 'Legs'],
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

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

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
    setBodyAreas([]); // Clear selected body areas when gender changes
    setShowWarning(false); // Reset warning state
  };

  const handleAreaClick = (area) => {
    setBodyAreas((prev) => {
      if (prev.includes(area)) return prev.filter((a) => a !== area);
      if (prev.length < 3) return [...prev, area];
      setShowWarning(true);
      return prev;
    });
  };

  const handlePriceRangeChange = (index, value) => {
    setPriceRange((prev) => {
      const newRange = [...prev];
      newRange[index] = value;
      return [Math.min(newRange[0], newRange[1]), Math.max(newRange[0], newRange[1])];
    });
  };

  return (
    <div className='interactive-recommendation-form'>
      <h1 className='page-title'>Find Your Ideal Procedure</h1>

      <div className='gender-buttons'>
        <button onClick={() => handleGenderChange('Male')} className={gender === 'Male' ? 'active' : ''}>
          Male
        </button>
        <button onClick={() => handleGenderChange('Female')} className={gender === 'Female' ? 'active' : ''}>
          Female
        </button>
      </div>

      {gender && (
        <div className='models-container'>
          <div className='model-view'>
            <h3>Front View</h3>
            <InteractiveSVG gender={gender} selectedAreas={bodyAreas} onAreaClick={handleAreaClick} view='front' />
          </div>
          <div className='model-view'>
            <h3>Back View</h3>
            <InteractiveSVG gender={gender} selectedAreas={bodyAreas} onAreaClick={handleAreaClick} view='back' />
          </div>
        </div>
      )}

      <div className='form-container'>
        <div className='form-section'>
          {showWarning && <div className='warning'>You can select a maximum of 3 body areas.</div>}
          <div className='selected-areas'>
            {bodyAreas.length > 0 ? (
              bodyAreas.map((area) => (
                <div key={area} className='selected-area-tag'>
                  {area}
                </div>
              ))
            ) : (
              <p>No areas selected</p>
            )}
          </div>

          <div className='price-range-container'>
            <div className='price-input'>
              <input
                type='text'
                value={priceRange[0] === minPrice ? 'No Min' : `$${priceRange[0].toLocaleString()}`}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  handlePriceRangeChange(0, value ? parseInt(value) : minPrice);
                }}
              />
            </div>
            <div className='price-slider'>
              <input
                type='range'
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
              />
              <input
                type='range'
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
              />
            </div>
            <div className='price-input'>
              <input
                type='text'
                value={priceRange[1] === maxPrice ? 'No Max' : `$${priceRange[1].toLocaleString()}`}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  handlePriceRangeChange(1, value ? parseInt(value) : maxPrice);
                }}
              />
            </div>
          </div>
          <button className='find-procedures' onClick={() => gender && bodyAreas.length > 0 && setShowResults(true)}>
            Find Matching Procedures
          </button>
        </div>
      </div>

      {showResults && (
        <div className='results'>
          {Object.keys(filteredData).length > 0 ? (
            <DoctorProcedures data={filteredData} selectedAreas={bodyAreas} priceRange={priceRange} gender={gender} />
          ) : (
            <div className='no-results'>No doctors available for the selected criteria.</div>
          )}
        </div>
      )}
    </div>
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
    <div className='svg-wrapper'>
      <svg width='100%' height='100%' viewBox='0 0 524.4 840'>
        <defs>
          <filter id='hover-filter'>
            <feFlood floodColor='#000000' result='flood' />
            <feComposite
              in='SourceGraphic'
              in2='flood'
              operator='arithmetic'
              k1='1'
              k2='0'
              k3='0'
              k4='0'
              result='composite'
            />
            <feBlend in='composite' in2='SourceGraphic' mode='hard-light' />
          </filter>
          <filter id='selected-filter'>
            <feFlood floodColor='#c8b275' result='flood' />
            <feComposite
              in='SourceGraphic'
              in2='flood'
              operator='arithmetic'
              k1='1'
              k2='0'
              k3='0'
              k4='0'
              result='composite'
            />
            <feBlend in='composite' in2='SourceGraphic' mode='hard-light' />
          </filter>
        </defs>
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
    </div>
  );
};
export default InteractiveRecommendationForm;
