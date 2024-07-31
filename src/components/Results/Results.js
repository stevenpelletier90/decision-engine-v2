import React, { useState, useMemo, useEffect } from 'react';
import './Results.css';

const formatPrice = (price) => {
  const numericPrice = typeof price === 'number' ? price : parseFloat(price.replace('$', '').replace(',', ''));
  return `$${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const findAllSurgeries = (data, selectedAreas, priceRange) => {
  const allSurgeries = [];
  Object.entries(data).forEach(([doctorName, doctorData]) => {
    selectedAreas.forEach((area) => {
      if (doctorData.Procedures[area]) {
        Object.entries(doctorData.Procedures[area]).forEach(([procedure, price]) => {
          const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
          if (numericPrice >= priceRange[0] && numericPrice <= priceRange[1]) {
            allSurgeries.push({
              doctor: doctorName,
              procedure: procedure,
              location: doctorData.Location,
              price: numericPrice,
              image: doctorData.Image,
              locationURL: doctorData.LocationUrl,
              bioURL: doctorData.BioUrl,
            });
          }
        });
      }
    });
  });
  return allSurgeries;
};

const CheapestSurgeries = ({ surgeries }) => {
  const cheapestByProcedure = useMemo(() => {
    const cheapest = {};
    surgeries.forEach((surgery) => {
      if (!cheapest[surgery.procedure] || surgery.price < cheapest[surgery.procedure].price) {
        cheapest[surgery.procedure] = surgery;
      }
    });
    return Object.values(cheapest).sort((a, b) => a.price - b.price);
  }, [surgeries]);

  const getDoctorImage = (imageName) => {
    if (imageName) {
      return require(`../../assets/images/${imageName}`);
    }
    return 'https://placehold.co/30x30';
  };

  return (
    <div className='cheapest-surgeries-section'>
      <h3 className='cheapest-surgeries-title'>Most Affordable Procedures</h3>
      <div className='cheapest-surgeries-list'>
        {cheapestByProcedure.map((surgery) => (
          <div key={surgery.procedure} className='cheapest-surgery-card'>
            <div className='mobile-card-title'>{surgery.procedure}</div>
            <div className='doctor-info'>
              <img src={getDoctorImage(surgery.image)} alt={surgery.doctor} className='doctor-avatar' />
              <a href={surgery.bioURL} target='_blank' rel='noopener noreferrer' className='link'>
                {surgery.doctor}
              </a>
            </div>
            <div>
              <strong>Location: </strong>
              <a href={surgery.locationURL} target='_blank' rel='noopener noreferrer' className='link'>
                {surgery.location}
              </a>
            </div>
            <div>
              <strong>Price: </strong>
              {formatPrice(surgery.price)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AllSurgeries = ({ surgeries }) => {
  const [orderBy, setOrderBy] = useState('price');
  const [order, setOrder] = useState('asc');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedSurgeries = useMemo(() => {
    const comparator = (a, b) => {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    };

    return [...surgeries].sort((a, b) => {
      return order === 'desc' ? comparator(a, b) : -comparator(a, b);
    });
  }, [surgeries, order, orderBy]);

  const getDoctorImage = (imageName) => {
    if (imageName) {
      return require(`../../assets/images/${imageName}`);
    }
    return 'https://placehold.co/30x30';
  };

  const renderDesktopView = () => (
    <table className='table'>
      <thead>
        <tr>
          <th>
            <button className='th-button' onClick={() => handleRequestSort('doctor')}>
              DOCTOR
              {orderBy === 'doctor' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
            </button>
          </th>
          <th>
            <button className='th-button' onClick={() => handleRequestSort('location')}>
              LOCATION
              {orderBy === 'location' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
            </button>
          </th>
          <th>
            <button className='th-button' onClick={() => handleRequestSort('price')}>
              PRICE
              {orderBy === 'price' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
            </button>
          </th>
          <th>
            <button className='th-button' onClick={() => handleRequestSort('procedure')}>
              PROCEDURE
              {orderBy === 'procedure' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedSurgeries.map((surgery, index) => (
          <tr key={index}>
            <td>
              <div className='doctor-info'>
                <img src={getDoctorImage(surgery.image)} alt={surgery.doctor} className='doctor-avatar' />
                <a href={surgery.bioURL} target='_blank' rel='noopener noreferrer' className='link'>
                  {surgery.doctor}
                </a>
              </div>
            </td>
            <td>
              <a href={surgery.locationURL} target='_blank' rel='noopener noreferrer' className='link'>
                {surgery.location}
              </a>
            </td>
            <td>
              <button
                className='view-price-button'
                onClick={() => {
                  console.log(`Show price details for ${surgery.procedure}: ${formatPrice(surgery.price)}`);
                }}
              >
                View Price
              </button>
            </td>
            <td>{surgery.procedure}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderMobileView = () => (
    <>
      <div className='mobile-sort-buttons'>
        {['doctor', 'location', 'price', 'procedure'].map((sortOption) => (
          <button
            key={sortOption}
            className={`mobile-sort-button ${orderBy === sortOption ? 'active' : ''}`}
            onClick={() => handleRequestSort(sortOption)}
          >
            {sortOption.toUpperCase()}
            {orderBy === sortOption && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
          </button>
        ))}
      </div>
      {sortedSurgeries.map((surgery) => (
        <div key={surgery.doctor + surgery.procedure} className='mobile-card'>
          <div className='mobile-card-title'>{surgery.procedure}</div>
          <div className='mobile-card-content'>
            <div className='mobile-card-item'>
              <strong>Doctor:</strong>
              <a href={surgery.bioURL} target='_blank' rel='noopener noreferrer' className='link'>
                {surgery.doctor}
              </a>
            </div>
            <div className='mobile-card-item'>
              <strong>Location:</strong>
              <a href={surgery.locationURL} target='_blank' rel='noopener noreferrer' className='link'>
                {surgery.location}
              </a>
            </div>
            <div className='mobile-card-item'>
              <strong>Price:</strong>
              <button
                className='view-price-button'
                onClick={() => {
                  console.log(`Show price details for ${surgery.procedure}: ${formatPrice(surgery.price)}`);
                }}
              >
                View Price
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className='all-surgeries'>
      <h2 className='section-title'>All Procedures</h2>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

const Results = ({ data, selectedAreas, priceRange }) => {
  const allSurgeries = findAllSurgeries(data, selectedAreas, priceRange);

  return (
    <div className='results-container'>
      <CheapestSurgeries surgeries={allSurgeries} />
      <AllSurgeries surgeries={allSurgeries} />
    </div>
  );
};

export default Results;
