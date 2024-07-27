import React from 'react';
import '../components/ViewTrip';  

const StarRating = ({ rating }) => {
  return (
    <div className="star2-rating">
      {[...Array(5)].map((star2, index) => {
        const ratingValue = index + 1;
        return (
          <span key={index} className={ratingValue <= rating ? "star2 filled" : "star2"}>
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
