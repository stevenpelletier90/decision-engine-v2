import React, { useState, useMemo } from 'react';
import '../styles/index.css';

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

const AllSurgeries = ({ surgeries }) => {
  const [orderBy, setOrderBy] = useState('price');
  const [order, setOrder] = useState('asc');

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
      return require(`../assets/images/${imageName}`);
    }
    return 'https://placehold.co/40x40';
  };

  return (
    <div className='all-surgeries'>
      <h2 className='doctors-title'>Your Procedure Results</h2>
      <table>
        <thead>
          <tr>
            <th>
              <button onClick={() => handleRequestSort('doctor')}>
                Doctor
                {orderBy === 'doctor' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th>
              <button onClick={() => handleRequestSort('procedure')}>
                Procedure
                {orderBy === 'procedure' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th>
              <button onClick={() => handleRequestSort('location')}>
                Location
                {orderBy === 'location' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th>
              <button onClick={() => handleRequestSort('price')}>
                Price
                {orderBy === 'price' && <span className='sort-indicator'>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='affordable-row'>
            <td colSpan='4'>Most Affordable</td>
          </tr>
          {sortedSurgeries.map((surgery, index) => (
            <tr key={index} className={index < 3 ? 'highlighted' : ''}>
              <td>
                <div className='doctor-info'>
                  <img src={getDoctorImage(surgery.image)} alt={surgery.doctor} className='doctor-avatar' />
                  <a href={surgery.bioURL} target='_blank' rel='noopener noreferrer'>
                    {surgery.doctor}
                  </a>
                </div>
              </td>
              <td>{surgery.procedure}</td>
              <td>
                <a href={surgery.locationURL} target='_blank' rel='noopener noreferrer'>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DoctorProcedures = ({ data, selectedAreas, priceRange }) => {
  const allSurgeries = findAllSurgeries(data, selectedAreas, priceRange);

  return (
    <div className='doctor-procedures'>
      <AllSurgeries surgeries={allSurgeries} />
    </div>
  );
};

export default DoctorProcedures;
