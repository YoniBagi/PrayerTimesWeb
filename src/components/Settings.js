import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load saved place from localStorage
    const savedPlace = localStorage.getItem('selectedPlace');
    if (savedPlace) {
      setSelectedPlace(savedPlace);
    }

    // Fetch and process prayer data to extract unique places
    const fetchAndProcessPlaces = async () => {
      try {
        const prayerTypes = ['sahrit', 'mincha', 'arvit'];
        const allPlaces = new Set(); // Using Set to automatically handle uniqueness

        // Fetch all prayer types in parallel
        const responses = await Promise.all(
          prayerTypes.map(prayerType => 
            fetch(`https://timesprayersdb.firebaseio.com/${prayerType}.json`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${prayerType}`);
                return res.json();
              })
          )
        );

        // Process each prayer type's data
        responses.forEach(prayerData => {
          if (prayerData) {
            Object.values(prayerData).forEach(entry => {
              if (entry && entry.place) {
                allPlaces.add(entry.place);
              }
            });
          }
        });

        // Convert Set to array of objects with id and name
        const placesArray = Array.from(allPlaces).map((place, index) => ({
          id: `place-${index}`,
          name: place
        }));

        setPlaces(placesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching and processing places:', error);
        setError('שגיאה בטעינת המקומות. אנא נסה שוב מאוחר יותר.');
        setLoading(false);
      }
    };

    fetchAndProcessPlaces();
  }, []);

  const handlePlaceChange = (event) => {
    const newPlace = event.target.value;
    setSelectedPlace(newPlace);
    localStorage.setItem('selectedPlace', newPlace);
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">הגדרות</h2>
      <div className="settings-card">
        <div className="settings-section">
          <label htmlFor="place-select" className="settings-label">
            בחר מקום
          </label>
          {loading ? (
            <div className="loading-spinner">טוען...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : places.length === 0 ? (
            <div className="no-places-message">אין מקומות זמינים</div>
          ) : (
            <select
              id="place-select"
              value={selectedPlace}
              onChange={handlePlaceChange}
              className="settings-select"
            >
              <option value="">בחר מקום</option>
              {places.map((place) => (
                <option key={place.id} value={place.name}>
                  {place.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {selectedPlace && places.length > 0 && (
          <div className="selected-place-info">
            <h3>בית כנסת מועדף</h3>
            <p>{selectedPlace}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 