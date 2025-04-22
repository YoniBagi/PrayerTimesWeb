import React, { useState, useEffect } from 'react';
import { getMaqamForParasha, extractParashaName } from '../utils/maqamUtils';
import './HebrewDate.css';

function HebrewDate() {
  const [calendarData, setCalendarData] = useState(null);
  const [maqam, setMaqam] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Fetch both Hebrew and English data
        const [hebrewResponse, englishResponse] = await Promise.all([
          fetch(`https://www.hebcal.com/converter?cfg=json&date=${dateStr}&g2h=0&lg=he&gs=on&maj=on`),
          fetch(`https://www.hebcal.com/converter?cfg=json&date=${dateStr}&g2h=0&lg=en`)
        ]);

        if (!hebrewResponse.ok || !englishResponse.ok) {
          throw new Error('Failed to fetch calendar data');
        }

        const [hebrewData, englishData] = await Promise.all([
          hebrewResponse.json(),
          englishResponse.json()
        ]);

        // Set Hebrew data for display
        setCalendarData(hebrewData);

        // Get Maqam info from English data
        const parashaName = extractParashaName(englishData.events);
        const maqamName = parashaName ? getMaqamForParasha(parashaName) : null;
        setMaqam(maqamName);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setError('שגיאה בטעינת נתוני לוח השנה');
      }
    };

    fetchCalendarData();
    // Update every hour
    const interval = setInterval(fetchCalendarData, 3600000);
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
          {maqam && (
            <div className="event-item maqam-info">
              מקאם {maqam}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HebrewDate; 