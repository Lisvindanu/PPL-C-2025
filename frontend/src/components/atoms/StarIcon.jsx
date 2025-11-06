// src/components/atoms/StarIcon.jsx
import React from 'react';

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="w-7 h-7 cursor-pointer transition-colors duration-150"
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.524 4.675a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.524 4.675c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.524-4.675a1 1 0 00-.363-1.118L2.09 10.102c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69L11.049 2.927z"
    />
  </svg>
);

export default StarIcon;