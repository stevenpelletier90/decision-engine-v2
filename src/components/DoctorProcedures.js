import React, { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
  Avatar,
} from '@mui/material';
import '../styles/index.css';

const formatPrice = (price) => {
  const numericPrice = typeof price === 'number' ? price : parseFloat(price.replace('$', '').replace(',', ''));
  return `$${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const findCheapestSurgeries = (data) => {
  const cheapestSurgeries = [];
  Object.entries(data).forEach(([doctorName, doctorData]) => {
    Object.entries(doctorData.Procedures).forEach(([area, procedures]) => {
      Object.entries(procedures).forEach(([procedure, price]) => {
        const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
        const existingIndex = cheapestSurgeries.findIndex((s) => s.procedure === procedure);
        if (existingIndex === -1 || numericPrice < cheapestSurgeries[existingIndex].price) {
          const surgeryInfo = {
            doctor: doctorName,
            procedure: procedure,
            location: doctorData.Location,
            price: numericPrice,
            image: doctorData.Image,
          };
          if (existingIndex === -1) {
            cheapestSurgeries.push(surgeryInfo);
          } else {
            cheapestSurgeries[existingIndex] = surgeryInfo;
          }
        }
      });
    });
  });
  return cheapestSurgeries;
};

const CheapestSurgeries = ({ surgeries }) => {
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
    <Box className='cheapest-surgeries'>
      <Typography variant='h5' gutterBottom className='doctors-title'>
        Your Procedure Results
      </Typography>
      <TableContainer component={Paper}>
        <Table size='small' className='cheapest-surgeries-table'>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'doctor'}
                  direction={orderBy === 'doctor' ? order : 'asc'}
                  onClick={() => handleRequestSort('doctor')}
                >
                  Doctor
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'procedure'}
                  direction={orderBy === 'procedure' ? order : 'asc'}
                  onClick={() => handleRequestSort('procedure')}
                >
                  Procedure
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={orderBy === 'location' ? order : 'asc'}
                  onClick={() => handleRequestSort('location')}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
                  {orderBy === 'price' && (
                    <Typography component='span' variant='caption' sx={{ marginLeft: 1 }}>
                      ({order === 'asc' ? 'Lowest to Highest' : 'Highest to Lowest'})
                    </Typography>
                  )}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSurgeries.map((surgery, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={getDoctorImage(surgery.image)}
                      alt={surgery.doctor}
                      sx={{ width: 40, height: 40, marginRight: 2 }}
                    />
                    {surgery.doctor}
                  </Box>
                </TableCell>
                <TableCell>{surgery.procedure}</TableCell>
                <TableCell>{surgery.location}</TableCell>
                <TableCell>
                  <Button
                    variant='contained'
                    size='small'
                    className='view-price-button'
                    onClick={() => {
                      // Placeholder for future popup functionality
                      console.log(`Show price details for ${surgery.procedure}: ${formatPrice(surgery.price)}`);
                    }}
                  >
                    View Price
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DoctorProcedures = ({ data }) => {
  const cheapestSurgeries = findCheapestSurgeries(data);

  return (
    <Box>
      <CheapestSurgeries surgeries={cheapestSurgeries} />
    </Box>
  );
};

export default DoctorProcedures;
