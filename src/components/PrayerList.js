import React from 'react';
import './PrayerList.css';

function PrayerList({ title, data }) {
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

  return (
    <div className="prayer-list">
      <h2>{title}</h2>
      <div className="prayer-items">
        {sortedPrayers.map(([key, value]) => (
          <div key={key} className="prayer-item">
            <h3>{value?.place || 'מקום לא זמין'}</h3>
            <p>{value?.time || 'שעה לא זמינה'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrayerList; 