import React, { useState } from 'react';

const RecommendationForm = ({ data }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [procedure, setProcedure] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Logic to determine the best recommendation based on the form input
    const recommendedDoctor = Object.keys(data).find((doctor) => {
      const doctorData = data[doctor];
      return doctorData.Location === location && doctorData.Procedures[procedure];
    });

    if (recommendedDoctor) {
      setRecommendation({
        doctor: recommendedDoctor,
        location: data[recommendedDoctor].Location,
        procedure,
        price: data[recommendedDoctor].Procedures[procedure],
      });
    } else {
      setRecommendation(null);
    }
  };

  return (
    <div>
      <h1>Find the Best Procedure and Doctor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Age:
            <input type='number' value={age} onChange={(e) => setAge(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Gender:
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value=''>Select...</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Location:
            <select value={location} onChange={(e) => setLocation(e.target.value)} required>
              <option value=''>Select...</option>
              {[...new Set(Object.values(data).map((d) => d.Location))].map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Procedure:
            <select value={procedure} onChange={(e) => setProcedure(e.target.value)} required>
              <option value=''>Select...</option>
              {[...new Set(Object.keys(data).flatMap((doctor) => Object.keys(data[doctor].Procedures)))].map((proc) => (
                <option key={proc} value={proc}>
                  {proc}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type='submit'>Get Recommendation</button>
      </form>
      {recommendation && (
        <div>
          <h2>Recommended Doctor and Procedure</h2>
          <p>Doctor: {recommendation.doctor}</p>
          <p>Location: {recommendation.location}</p>
          <p>Procedure: {recommendation.procedure}</p>
          <p>Price: {recommendation.price}</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationForm;
