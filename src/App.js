import React, { useEffect, useState } from 'react';
import Form from './components/Form/Form';
import './styles/index.css';

const App = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrl =
      process.env.NODE_ENV === 'production' ? '/decision-engine-v2/doctor_procedures.json' : '/doctor_procedures.json';

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((fetchedData) => {
        console.log('Fetched data:', fetchedData);
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='app'>
      <div className='container'>
        {loading ? (
          <div className='loading'>
            <div className='spinner'></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className='error'>
            <p>Error fetching data: {error.message}</p>
          </div>
        ) : (
          <Form data={data} />
        )}
      </div>
    </div>
  );
};

export default App;
