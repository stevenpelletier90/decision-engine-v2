import React, { useState, useMemo } from 'react';
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

import '../styles/index.css';

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

  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const [min, max] = priceRange;
    if (e.target.id === 'minPrice') {
      setPriceRange([Math.min(value, max), max]);
    } else {
      setPriceRange([min, Math.max(value, min)]);
    }
  };

  return (
    <div className='interactive-recommendation-form'>
      <h1 className='page-title'>Find Your Ideal Procedure</h1>

      <div className='form-container'>
        <div className='form-section'>
          {gender && (
            <>
              <div className='svg-container'>
                <InteractiveSVG gender={gender} selectedAreas={bodyAreas} onAreaClick={handleAreaClick} view={view} />
              </div>
              <div className='view-buttons'>
                <button onClick={() => setView('front')} className={view === 'front' ? 'active' : ''}>
                  Front View
                </button>
                <button onClick={() => setView('back')} className={view === 'back' ? 'active' : ''}>
                  Back View
                </button>
              </div>
            </>
          )}
        </div>
        <div className='form-section'>
          <div className='gender-buttons'>
            <button onClick={() => handleGenderChange('Male')} className={gender === 'Male' ? 'active' : ''}>
              Male
            </button>
            <button onClick={() => handleGenderChange('Female')} className={gender === 'Female' ? 'active' : ''}>
              Female
            </button>
          </div>
          {showWarning && <div className='warning'>You can select a maximum of 3 body areas.</div>}
          <div className='price-range'>
            <h2>Ideal Budget</h2>
            <div className='price-inputs'>
              <input
                type='number'
                id='minPrice'
                value={priceRange[0]}
                onChange={handlePriceRangeChange}
                min={minPrice}
                max={priceRange[1]}
              />
              <input
                type='number'
                id='maxPrice'
                value={priceRange[1]}
                onChange={handlePriceRangeChange}
                min={priceRange[0]}
                max={maxPrice}
              />
            </div>
            <input
              type='range'
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className='price-slider'
            />
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
      <div className='selected-areas'>
        {selectedAreas.length > 0 ? (
          selectedAreas.map((area) => (
            <div key={area} className='selected-area-tag'>
              {area}
            </div>
          ))
        ) : (
          <p>No areas selected</p>
        )}
      </div>
    </div>
  );
};

export default InteractiveRecommendationForm;
