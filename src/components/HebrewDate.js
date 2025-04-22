import React, { useState, useEffect } from 'react';

function HebrewDate() {
  const [hebrewDate, setHebrewDate] = useState(null);

  useEffect(() => {
    const fetchHebrewDate = async () => {
      try {
        const response = await fetch('https://www.hebcal.com/converter?cfg=json&date=now&g2h=1');
        const data = await response.json();
        setHebrewDate(data.hebrew);
      } catch (error) {
        console.error('Error fetching Hebrew date:', error);
      }
    };

    fetchHebrewDate();
  }, []);

  return (
    <div className="hebrew-date">
      <span>{hebrewDate || 'טוען...'}</span>
    </div>
  );
}

export default HebrewDate; 