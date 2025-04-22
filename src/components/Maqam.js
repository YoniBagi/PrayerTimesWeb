import React, { useState, useEffect } from 'react';
import { getMaqamForParasha, extractParashaName } from '../utils/maqamUtils';
import './Maqam.css';

function Maqam() {
  const [maqamInfo, setMaqamInfo] = useState({
    parasha: null,
    maqam: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchMaqamInfo = async () => {
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        console.log('Fetching maqam info for date:', dateStr);
        
        const response = await fetch(
          `https://www.hebcal.com/converter?cfg=json&date=${dateStr}&g2h=0&lg=en`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch parasha data');
        }

        const data = await response.json();
        console.log('Hebcal API response:', data);
        
        const parashaName = extractParashaName(data.events);
        console.log('Extracted parasha name:', parashaName);
        
        const maqam = parashaName ? getMaqamForParasha(parashaName) : null;
        console.log('Determined maqam:', maqam);

        setMaqamInfo({
          parasha: parashaName,
          maqam: maqam,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching maqam info:', error);
        setMaqamInfo(prev => ({
          ...prev,
          loading: false,
          error: 'שגיאה בטעינת מידע המקאם'
        }));
      }
    };

    fetchMaqamInfo();
  }, []);

  console.log('Current maqamInfo:', maqamInfo);

  if (maqamInfo.loading) {
    return <div className="maqam-container loading">טוען...</div>;
  }

  if (maqamInfo.error) {
    return <div className="maqam-container error">{maqamInfo.error}</div>;
  }

  if (!maqamInfo.parasha || !maqamInfo.maqam) {
    console.log('No parasha or maqam data available');
    return null;
  }

  return (
    <div className="maqam-container">
      <h2>מקאם השבוע</h2>
      <div className="maqam-content">
        <div className="parasha-name">
          פרשת {maqamInfo.parasha}
        </div>
        <div className="maqam-name">
          מקאם {maqamInfo.maqam}
        </div>
      </div>
    </div>
  );
}

export default Maqam; 