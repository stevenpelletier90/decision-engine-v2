import React, { useEffect, useState } from 'react';

const DoctorProcedures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/doctor_procedures.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  return (
    <div>
      <h1>Doctor Procedures and Prices</h1>
      {Object.keys(data).map((doctor) => (
        <div key={doctor}>
          <h2>{doctor}</h2>
          <p>Location: {data[doctor].Location}</p>
          <h3>Procedures:</h3>
          <ul>
            {Object.keys(data[doctor].Procedures).map((procedure) => (
              <li key={procedure}>
                {procedure}: {data[doctor].Procedures[procedure]}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DoctorProcedures;
