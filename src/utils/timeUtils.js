export function getCurrentPrayer(prayers) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Helper function to get the latest time for a prayer type
  const getLatestTime = (prayerData) => {
    if (!prayerData) return 0;
    return Math.max(...Object.values(prayerData)
      .map(p => {
        const [hours, minutes] = (p.time || '00:00').split(':').map(Number);
        return hours * 60 + minutes;
      }));
  };

  // Get latest times for each prayer
  const latestShacharit = getLatestTime(prayers.sahrit);
  const latestMincha = getLatestTime(prayers.mincha);
  const latestArvit = getLatestTime(prayers.arvit);

  // Determine current prayer based on time
  if (currentTime <= latestShacharit) {
    return { type: 'sahrit', title: 'שחרית' };
  } else if (currentTime <= latestMincha) {
    return { type: 'mincha', title: 'מנחה' };
  } else if (currentTime <= latestArvit) {
    return { type: 'arvit', title: 'ערבית' };
  } else {
    return { type: 'sahrit', title: 'שחרית (מחר)' };
  }
} 