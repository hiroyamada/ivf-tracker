import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TEMPERATURES: '@temperatures',
  PERIODS: '@periods',
  SEX_LOG: '@sex_log',
  MEDICATIONS: '@medications',
  OVULATION_TESTS: '@ovulation_tests',
  PREGNANCY_TESTS: '@pregnancy_tests',
  CLINIC_PROCEDURES: '@clinic_procedures',
};

// Generic storage functions
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading data:', e);
    return [];
  }
};

// Temperature functions
export const addTemperature = async (temperature, date = new Date()) => {
  const temps = await getData(KEYS.TEMPERATURES);
  temps.push({ value: temperature, date: date.toISOString() });
  temps.sort((a, b) => new Date(a.date) - new Date(b.date));
  await storeData(KEYS.TEMPERATURES, temps);
};

export const getTemperatures = async () => {
  return await getData(KEYS.TEMPERATURES);
};

// Period functions
export const addPeriod = async (startDate, endDate = null) => {
  const periods = await getData(KEYS.PERIODS);
  periods.push({
    startDate: startDate.toISOString(),
    endDate: endDate ? endDate.toISOString() : null
  });
  periods.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  await storeData(KEYS.PERIODS, periods);
};

export const updatePeriodEndDate = async (startDate, endDate) => {
  const periods = await getData(KEYS.PERIODS);
  const period = periods.find(p => p.startDate === startDate.toISOString());
  if (period) {
    period.endDate = endDate.toISOString();
    await storeData(KEYS.PERIODS, periods);
  }
};

export const getPeriods = async () => {
  return await getData(KEYS.PERIODS);
};

// Sex log functions
export const addSexLog = async (date = new Date()) => {
  const logs = await getData(KEYS.SEX_LOG);
  logs.push({ date: date.toISOString() });
  logs.sort((a, b) => new Date(a.date) - new Date(b.date));
  await storeData(KEYS.SEX_LOG, logs);
};

export const getSexLogs = async () => {
  return await getData(KEYS.SEX_LOG);
};

// Medication functions
export const addMedication = async (name, type, amount, unit, date = new Date()) => {
  const meds = await getData(KEYS.MEDICATIONS);
  meds.push({
    name,
    type,
    amount,
    unit,
    date: date.toISOString()
  });
  meds.sort((a, b) => new Date(a.date) - new Date(b.date));
  await storeData(KEYS.MEDICATIONS, meds);
};

export const getMedications = async () => {
  return await getData(KEYS.MEDICATIONS);
};

// Ovulation test functions
export const addOvulationTest = async (result, date = new Date()) => {
  const tests = await getData(KEYS.OVULATION_TESTS);
  tests.push({
    result, // 'positive', 'negative', 'peak'
    date: date.toISOString()
  });
  tests.sort((a, b) => new Date(a.date) - new Date(b.date));
  await storeData(KEYS.OVULATION_TESTS, tests);
};

export const getOvulationTests = async () => {
  return await getData(KEYS.OVULATION_TESTS);
};

// Pregnancy test functions
export const addPregnancyTest = async (result, date = new Date()) => {
  const tests = await getData(KEYS.PREGNANCY_TESTS);
  tests.push({
    result, // 'positive', 'negative'
    date: date.toISOString()
  });
  tests.sort((a, b) => new Date(a.date) - new Date(b.date));
  await storeData(KEYS.PREGNANCY_TESTS, tests);
};

export const getPregnancyTests = async () => {
  return await getData(KEYS.PREGNANCY_TESTS);
};

// Clinic procedure functions
export const addClinicProcedure = async (name, notes, date = new Date()) => {
  const procedures = await getData(KEYS.CLINIC_PROCEDURES);
  procedures.push({
    name,
    notes,
    date: date.toISOString()
  });
  procedures.sort((a, b) => new Date(a.date) - new Date(b.date));
  await storeData(KEYS.CLINIC_PROCEDURES, procedures);
};

export const getClinicProcedures = async () => {
  return await getData(KEYS.CLINIC_PROCEDURES);
};

// Clear all data (for testing)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.error('Error clearing data:', e);
  }
};
