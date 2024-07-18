import React from 'react';

const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      {trip.imageUrl && <img src={trip.imageUrl} alt={trip.title} />}
      <h3>{trip.title}</h3>
      <p>{trip.description}</p>
    </div>
  );
};

export default TripCard;
