import React, { useState, useEffect } from 'react';
import './HebrewDate.css';

function HebrewDate() {
  const [calendarData, setCalendarData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHebrewDate = async () => {
      try {
        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        const response = await fetch(
          `https://www.hebcal.com/converter?cfg=json&date=${dateStr}&g2h=0&lg=he&gs=on&maj=on`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }

        const data = await response.json();
        setCalendarData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching Hebrew date:', error);
        setError('שגיאה בטעינת נתוני לוח השנה');
      }
    };

    fetchHebrewDate();
    // Update every hour
    const interval = setInterval(fetchHebrewDate, 3600000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="hebrew-date error">{error}</div>;
  }

  if (!calendarData) {
    return <div className="hebrew-date loading">טוען נתוני לוח שנה...</div>;
  }

  const formatGregorianDate = (gy, gm, gd) => {
    const date = new Date(gy, gm - 1, gd);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="hebrew-date-container">
      <div className="date-section">
        <div className="gregorian-date">
          {formatGregorianDate(calendarData.gy, calendarData.gm, calendarData.gd)}
        </div>
        <div className="hebrew-date">
          {calendarData.hebrew}
        </div>
      </div>
      
      {calendarData.events && calendarData.events.length > 0 && (
        <div className="events-section">
          {calendarData.events.map((event, index) => (
            <div key={index} className="event-item">
              {event}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HebrewDate; 