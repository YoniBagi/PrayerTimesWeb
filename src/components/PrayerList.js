import React, { useState, useEffect } from 'react';
import './PrayerList.css';

function PrayerList({ title, data }) {
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    // Load selected place from localStorage
    const savedPlace = localStorage.getItem('selectedPlace');
    if (savedPlace) {
      setSelectedPlace(savedPlace);
    }
  }, []);

  console.log(`PrayerList ${title} data:`, data);

  if (!data) {
    console.log(`No data for ${title}`);
    return null;
  }

  // Check if data is an object and has entries
  if (typeof data !== 'object' || Object.keys(data).length === 0) {
    console.log(`Empty or invalid data for ${title}`);
    return (
      <div className="prayer-list">
        <h2>{title}</h2>
        <p>אין נתונים זמינים</p>
      </div>
    );
  }

  // Convert object entries to array and sort by time
  const sortedPrayers = Object.entries(data).sort((a, b) => {
    const timeA = a[1]?.time || '';
    const timeB = b[1]?.time || '';
    
    // Convert times to minutes for comparison
    const getMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    return getMinutes(timeA) - getMinutes(timeB);
  });

  // Find the selected place's prayer time
  const selectedPlacePrayer = selectedPlace
    ? sortedPrayers.find(([_, value]) => value?.place === selectedPlace)
    : null;

  return (
    <div className="prayer-list">
      <h2>{title}</h2>
      {selectedPlace && (
        <div className="selected-place-banner">
          <div className="selected-place-content">
            <span className="selected-place-label">בית כנסת מועדף:</span>
            <span className="selected-place-name">{selectedPlace}</span>
            {selectedPlacePrayer && (
              <span className="selected-place-time">
                {selectedPlacePrayer[1]?.time || 'שעה לא זמינה'}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="prayer-items">
        {sortedPrayers.map(([key, value]) => (
          <div 
            key={key} 
            className={`prayer-item ${value?.place === selectedPlace ? 'selected' : ''}`}
          >
            <h3>{value?.place || 'מקום לא זמין'}</h3>
            <p>{value?.time || 'שעה לא זמינה'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrayerList; 