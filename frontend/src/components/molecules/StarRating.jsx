import React, { useState } from 'react';
import StarIcon from '../atoms/StarIcon'; // Import atom

const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <StarIcon
          key={index}
          filled={index <= (hoverRating || rating)}
          onClick={() => setRating(index)}
          onMouseEnter={() => setHoverRating(index)}
          onMouseLeave={() => setHoverRating(0)}
          className={`
            ${index <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}
            hover:text-yellow-400
          `}
        />
      ))}
    </div>
  );
};

export default StarRating;