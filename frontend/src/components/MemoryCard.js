import React from 'react';
import './MemoryCard.css';

const MemoryCard = ({ title, category, date, description, imageUrl }) => {
  return (
    <div className="memory-card">
      <img src={imageUrl} alt={title} className="memory-image" />
      <div className="memory-details">
        <h3>{title}</h3>
        <p>{category}</p>
        <p>{description}</p>
        <p>{new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default MemoryCard;
