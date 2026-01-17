// Calculate average cycle length from period data
export const calculateAverageCycleLength = (periods) => {
  if (periods.length < 2) return 28; // Default cycle length

  const cycleLengths = [];
  for (let i = 1; i < periods.length; i++) {
    const start1 = new Date(periods[i - 1].startDate);
    const start2 = new Date(periods[i].startDate);
    const diff = Math.round((start2 - start1) / (1000 * 60 * 60 * 24));
    cycleLengths.push(diff);
  }

  const sum = cycleLengths.reduce((a, b) => a + b, 0);
  return Math.round(sum / cycleLengths.length);
};

// Predict next period
export const predictNextPeriod = (periods) => {
  if (periods.length === 0) return null;

  const avgCycleLength = calculateAverageCycleLength(periods);
  const lastPeriod = periods[periods.length - 1];
  const lastStart = new Date(lastPeriod.startDate);

  const nextPeriodDate = new Date(lastStart);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);

  return nextPeriodDate;
};

// Predict ovulation (typically 14 days before next period)
export const predictOvulation = (periods) => {
  const nextPeriod = predictNextPeriod(periods);
  if (!nextPeriod) return null;

  const ovulationDate = new Date(nextPeriod);
  ovulationDate.setDate(ovulationDate.getDate() - 14);

  return ovulationDate;
};

// Get current cycle day
export const getCurrentCycleDay = (periods) => {
  if (periods.length === 0) return null;

  const lastPeriod = periods[periods.length - 1];
  const lastStart = new Date(lastPeriod.startDate);
  const today = new Date();

  const diff = Math.round((today - lastStart) / (1000 * 60 * 60 * 24));
  return diff + 1; // Day 1 is the first day of period
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format date as MM/DD
export const formatShortDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

// Get data for the last N days
export const getRecentData = (data, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return data.filter(item => new Date(item.date) >= cutoffDate);
};

// Check if date is today
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

// Check if date is in fertile window (5 days before ovulation to 1 day after)
export const isInFertileWindow = (date, periods) => {
  const ovulationDate = predictOvulation(periods);
  if (!ovulationDate) return false;

  const d = new Date(date);
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);
  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  return d >= fertileStart && d <= fertileEnd;
};

// Get most recent entry from array
export const getMostRecent = (data) => {
  if (!data || data.length === 0) return null;
  return data[data.length - 1];
};

// Calculate average temperature from recent data
export const calculateAverageTemperature = (temperatures, days = 30) => {
  const recent = getRecentData(temperatures, days);
  if (recent.length === 0) return null;

  const sum = recent.reduce((acc, temp) => acc + parseFloat(temp.value), 0);
  return (sum / recent.length).toFixed(2);
};
