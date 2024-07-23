import React, { useState, useMemo } from 'react';

const styles = {
  allSurgeries: {
    marginBottom: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  doctorsTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1b1b1b',
    textAlign: 'center',
    marginBottom: '1rem',
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    fontSize: '12px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #e0e0e0',
    verticalAlign: 'middle',
  },
  thButton: {
    background: 'none',
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    padding: 0,
  },
  sortIndicator: {
    marginLeft: '5px',
  },
  affordableRow: {
    backgroundColor: '#c8b273',
    color: '#1b1b1b',
    fontWeight: 700,
  },
  affordableRowTd: {
    padding: '8px 16px',
  },
  highlighted: {
    borderLeft: '2px solid #c8b273',
    borderRight: '2px solid #c8b273',
  },
  highlightedLast: {
    borderBottom: '2px solid #c8b273',
  },
  doctorInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: '30px',
    height: '30px',
    marginRight: '8px',
  },
  viewPriceButton: {
    backgroundColor: '#c8b273',
    color: '#1b1b1b',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background-color 0.3s ease',
    fontSize: '12px',
  },
};

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
    return 'https://placehold.co/30x30';
  };

  return (
    <div style={styles.allSurgeries}>
      <h2 style={styles.doctorsTitle}>YOUR PROCEDURE RESULTS</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>
              <button style={styles.thButton} onClick={() => handleRequestSort('doctor')}>
                DOCTOR
                {orderBy === 'doctor' && <span style={styles.sortIndicator}>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th style={styles.th}>
              <button style={styles.thButton} onClick={() => handleRequestSort('location')}>
                LOCATION
                {orderBy === 'location' && <span style={styles.sortIndicator}>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th style={styles.th}>
              <button style={styles.thButton} onClick={() => handleRequestSort('price')}>
                PRICE
                {orderBy === 'price' && <span style={styles.sortIndicator}>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
            <th style={styles.th}>
              <button style={styles.thButton} onClick={() => handleRequestSort('procedure')}>
                PROCEDURE
                {orderBy === 'procedure' && <span style={styles.sortIndicator}>{order === 'asc' ? '▲' : '▼'}</span>}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={styles.affordableRow}>
            <td style={styles.affordableRowTd} colSpan='4'>
              MOST AFFORDABLE
            </td>
          </tr>
          {sortedSurgeries.map((surgery, index) => (
            <tr
              key={index}
              style={index < 3 ? { ...styles.highlighted, ...(index === 2 ? styles.highlightedLast : {}) } : null}
            >
              <td style={styles.td}>
                <div style={styles.doctorInfo}>
                  <img src={getDoctorImage(surgery.image)} alt={surgery.doctor} style={styles.doctorAvatar} />
                  <a href={surgery.bioURL} target='_blank' rel='noopener noreferrer'>
                    {surgery.doctor}
                  </a>
                </div>
              </td>
              <td style={styles.td}>
                <a href={surgery.locationURL} target='_blank' rel='noopener noreferrer'>
                  {surgery.location}
                </a>
              </td>
              <td style={styles.td}>
                <button
                  style={styles.viewPriceButton}
                  onClick={() => {
                    console.log(`Show price details for ${surgery.procedure}: ${formatPrice(surgery.price)}`);
                  }}
                >
                  View Price
                </button>
              </td>
              <td style={styles.td}>{surgery.procedure}</td>
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
