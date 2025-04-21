import React, { useState, useEffect } from 'react';
import './App.css';
import PrayerList from './components/PrayerList';

function App() {
  const [advertising, setAdvertising] = useState(null);
  const [prayers, setPrayers] = useState({
    sahrit: null,
    mincha: null,
    arvit: null
  });

  useEffect(() => {
    // Fetch advertising
    fetch('https://timesprayersdb.firebaseio.com/advertising.json')
      .then(res => res.json())
      .then(data => {
        console.log('Advertising data:', data);
        setAdvertising(data);
      })
      .catch(error => console.error('Error fetching advertising:', error));

    // Fetch prayers
    const fetchPrayers = async () => {
      const prayerTypes = ['sahrit', 'mincha', 'arvit'];
      const results = {};

      try {
        for (const prayer of prayerTypes) {
          const response = await fetch(`https://timesprayersdb.firebaseio.com/${prayer}.json`);
          const data = await response.json();
          console.log(`${prayer} data:`, data);
          results[prayer] = data;
        }

        setPrayers(results);
      } catch (error) {
        console.error('Error fetching prayers:', error);
      }
    };

    fetchPrayers();
  }, []);

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        {advertising && (
          <img 
            src={advertising} 
            alt="פרסומת"
            className="advertising-image"
          />
        )}
        <h1>זמני תפילות</h1>
      </header>
      <main className="prayer-container">
        <PrayerList 
          title="שחרית"
          data={prayers.sahrit}
        />
        <PrayerList 
          title="מנחה"
          data={prayers.mincha}
        />
        <PrayerList 
          title="ערבית"
          data={prayers.arvit}
        />
      </main>
    </div>
  );
}

export default App; 