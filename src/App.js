import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PrayerList from './components/PrayerList';
import Clock from './components/Clock';
import HebrewDate from './components/HebrewDate';
import { getCurrentPrayer } from './utils/timeUtils';

function App() {
  const [advertising, setAdvertising] = useState(null);
  const [prayers, setPrayers] = useState({
    sahrit: null,
    mincha: null,
    arvit: null
  });
  const [currentPrayer, setCurrentPrayer] = useState(null);

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
          results[prayer] = data;
        }
        setPrayers(results);
      } catch (error) {
        console.error('Error fetching prayers:', error);
      }
    };

    fetchPrayers();
  }, []);

  // Update current prayer based on time
  useEffect(() => {
    const updateCurrentPrayer = () => {
      const current = getCurrentPrayer(prayers);
      setCurrentPrayer(current);
    };

    updateCurrentPrayer();
    const interval = setInterval(updateCurrentPrayer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayers]);

  return (
    <Router basename="/PrayerTimesWeb">
      <div className="app" dir="rtl">
        <header className="app-header">
          {advertising && (
            <img src={advertising} alt="פרסומת" className="advertising-image" />
          )}
          <div className="header-info">
            <Clock />
            <HebrewDate />
          </div>
          <div className="header-content">
            <h1>זמני תפילות</h1>
            <nav>
              <Link to="/">ראשי</Link> |{' '}
              <Link to="/shacharit">שחרית</Link> |{' '}
              <Link to="/mincha">מנחה</Link> |{' '}
              <Link to="/arvit">ערבית</Link>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={
            <main>
              <div className="prayer-container">
                <PrayerList 
                  title={currentPrayer?.title || 'טוען...'}
                  data={prayers[currentPrayer?.type]}
                />
              </div>
            </main>
          } />
          <Route path="/shacharit" element={
            <main className="prayer-container">
              <PrayerList title="שחרית" data={prayers.sahrit} />
            </main>
          } />
          <Route path="/mincha" element={
            <main className="prayer-container">
              <PrayerList title="מנחה" data={prayers.mincha} />
            </main>
          } />
          <Route path="/arvit" element={
            <main className="prayer-container">
              <PrayerList title="ערבית" data={prayers.arvit} />
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 