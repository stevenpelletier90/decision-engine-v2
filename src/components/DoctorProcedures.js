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
  Link,
  Avatar,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import '../styles/index.scss';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #e0e0e0',
  padding: '12px 16px',
  '&.MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#f9f9f9',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#c8b273',
  color: '#1b1b1b',
  '&:hover': {
    backgroundColor: '#b09a5f',
  },
}));

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
    <Box className='all-surgeries'>
      <Typography variant='h5' gutterBottom className='doctors-title'>
        Your Procedure Results
      </Typography>
      <TableContainer component={Paper} elevation={0}>
        <Table size='small' className='all-surgeries-table'>
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <TableSortLabel
                  active={orderBy === 'doctor'}
                  direction={orderBy === 'doctor' ? order : 'asc'}
                  onClick={() => handleRequestSort('doctor')}
                >
                  Doctor
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={orderBy === 'procedure'}
                  direction={orderBy === 'procedure' ? order : 'asc'}
                  onClick={() => handleRequestSort('procedure')}
                >
                  Procedure
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={orderBy === 'location' ? order : 'asc'}
                  onClick={() => handleRequestSort('location')}
                >
                  Location
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
                </TableSortLabel>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSurgeries.map((surgery, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={getDoctorImage(surgery.image)}
                      alt={surgery.doctor}
                      sx={{ width: 40, height: 40, marginRight: 2 }}
                    />
                    <Link href={surgery.bioURL} target='_blank' rel='noopener noreferrer'>
                      {surgery.doctor}
                    </Link>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>{surgery.procedure}</StyledTableCell>
                <StyledTableCell>
                  <Link href={surgery.locationURL} target='_blank' rel='noopener noreferrer'>
                    {surgery.location}
                  </Link>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledButton
                    variant='contained'
                    size='small'
                    onClick={() => {
                      console.log(`Show price details for ${surgery.procedure}: ${formatPrice(surgery.price)}`);
                    }}
                  >
                    View Price
                  </StyledButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DoctorProcedures = ({ data, selectedAreas, priceRange }) => {
  const allSurgeries = findAllSurgeries(data, selectedAreas, priceRange);

  return (
    <Box>
      <AllSurgeries surgeries={allSurgeries} />
    </Box>
  );
};

export default DoctorProcedures;
