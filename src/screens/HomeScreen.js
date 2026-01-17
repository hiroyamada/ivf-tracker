import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import MetricCard from '../components/MetricCard';
import MiniChart from '../components/MiniChart';
import AddDataModal from '../components/AddDataModal';
import {
  getTemperatures,
  getPeriods,
  getSexLogs,
  getMedications,
  getOvulationTests,
  getPregnancyTests,
  getClinicProcedures,
  addTemperature,
  addPeriod,
  addSexLog,
  addMedication,
  addOvulationTest,
  addPregnancyTest,
  addClinicProcedure,
} from '../utils/storage';
import {
  calculateAverageTemperature,
  predictNextPeriod,
  predictOvulation,
  getCurrentCycleDay,
  formatDate,
  getMostRecent,
  getRecentData,
} from '../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Data state
  const [temperatures, setTemperatures] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [sexLogs, setSexLogs] = useState([]);
  const [medications, setMedications] = useState([]);
  const [ovulationTests, setOvulationTests] = useState([]);
  const [pregnancyTests, setPregnancyTests] = useState([]);
  const [clinicProcedures, setClinicProcedures] = useState([]);

  const loadData = async () => {
    const [temps, pers, sex, meds, ovTests, pregTests, procedures] = await Promise.all([
      getTemperatures(),
      getPeriods(),
      getSexLogs(),
      getMedications(),
      getOvulationTests(),
      getPregnancyTests(),
      getClinicProcedures(),
    ]);

    setTemperatures(temps);
    setPeriods(pers);
    setSexLogs(sex);
    setMedications(meds);
    setOvulationTests(ovTests);
    setPregnancyTests(pregTests);
    setClinicProcedures(procedures);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddData = async (type, data) => {
    try {
      switch (type) {
        case 'temperature':
          await addTemperature(parseFloat(data.value));
          break;
        case 'period':
          await addPeriod(new Date());
          break;
        case 'sex':
          await addSexLog(new Date());
          break;
        case 'medication':
          await addMedication(data.name, data.type, data.amount, data.unit);
          break;
        case 'ovulation_test':
          await addOvulationTest(data.result);
          break;
        case 'pregnancy_test':
          await addPregnancyTest(data.result);
          break;
        case 'clinic':
          await addClinicProcedure(data.name, data.notes || '');
          break;
      }
      await loadData();
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  // Calculate derived data
  const latestTemp = getMostRecent(temperatures);
  const avgTemp = calculateAverageTemperature(temperatures, 30);
  const nextPeriod = predictNextPeriod(periods);
  const ovulationDate = predictOvulation(periods);
  const cycleDay = getCurrentCycleDay(periods);
  const recentTemps = getRecentData(temperatures, 7);

  // Determine the most relevant metric
  const getMostRelevantMetric = () => {
    // If ovulation is predicted within the next 3 days, show that
    if (ovulationDate) {
      const daysToOvulation = Math.ceil((ovulationDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysToOvulation >= 0 && daysToOvulation <= 3) {
        return {
          title: 'Predicted Ovulation',
          value: formatDate(ovulationDate),
          subtitle: `In ${daysToOvulation} day${daysToOvulation !== 1 ? 's' : ''}`,
          color: colors.ovulation,
        };
      }
    }

    // If period is predicted within the next 5 days, show that
    if (nextPeriod) {
      const daysToPeriod = Math.ceil((nextPeriod - new Date()) / (1000 * 60 * 60 * 24));
      if (daysToPeriod >= 0 && daysToPeriod <= 5) {
        return {
          title: 'Predicted Period',
          value: formatDate(nextPeriod),
          subtitle: `In ${daysToPeriod} day${daysToPeriod !== 1 ? 's' : ''}`,
          color: colors.period,
        };
      }
    }

    // Otherwise show today's temperature if available
    if (latestTemp) {
      return {
        title: 'Basal Body Temperature',
        value: latestTemp.value,
        unit: '°C',
        subtitle: formatDate(latestTemp.date),
        color: colors.temperature,
        chart: recentTemps.length > 1 ? <MiniChart data={recentTemps} color={colors.temperature} /> : null,
      };
    }

    // Default: show cycle day
    if (cycleDay) {
      return {
        title: 'Cycle Day',
        value: cycleDay.toString(),
        subtitle: periods.length > 0 ? `Started ${formatDate(periods[periods.length - 1].startDate)}` : '',
        color: colors.period,
      };
    }

    return {
      title: 'Welcome to IVF Tracker',
      value: '👋',
      subtitle: 'Tap the + button below to start tracking',
      color: colors.primary,
    };
  };

  const mainMetric = getMostRelevantMetric();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>IVF Tracker</Text>
        </View>

        {/* Main Metric Card */}
        <MetricCard
          title={mainMetric.title}
          value={mainMetric.value}
          unit={mainMetric.unit}
          subtitle={mainMetric.subtitle}
          color={mainMetric.color}
          chart={mainMetric.chart}
        />

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Add Data</Text>
        </TouchableOpacity>

        {/* Metrics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Metrics</Text>

          {/* Temperature Card */}
          {temperatures.length > 0 && (
            <MetricCard
              title="Basal Body Temperature"
              value={latestTemp?.value || '--'}
              unit="°C"
              subtitle={`Avg: ${avgTemp || '--'}°C (30 days)`}
              color={colors.temperature}
              chart={recentTemps.length > 1 ? <MiniChart data={recentTemps} color={colors.temperature} /> : null}
              onPress={() => navigation.navigate('Temperature')}
            />
          )}

          {/* Cycle Info */}
          {periods.length > 0 && (
            <MetricCard
              title="Cycle Information"
              value={cycleDay ? `Day ${cycleDay}` : '--'}
              subtitle={nextPeriod ? `Next period: ${formatDate(nextPeriod)}` : ''}
              color={colors.period}
              onPress={() => navigation.navigate('Cycle')}
            />
          )}

          {/* Medications */}
          {medications.length > 0 && (
            <MetricCard
              title="Medications"
              value={medications.length.toString()}
              subtitle={`${getMostRecent(medications)?.name || 'Recent entry'}`}
              color={colors.medication}
              onPress={() => navigation.navigate('Medications')}
            />
          )}

          {/* Recent Tests */}
          {(ovulationTests.length > 0 || pregnancyTests.length > 0) && (
            <MetricCard
              title="Test Results"
              value={`${ovulationTests.length + pregnancyTests.length}`}
              subtitle="Ovulation & Pregnancy tests"
              color={colors.ovulation}
              onPress={() => navigation.navigate('Tests')}
            />
          )}

          {/* Clinic Procedures */}
          {clinicProcedures.length > 0 && (
            <MetricCard
              title="Clinic Procedures"
              value={clinicProcedures.length.toString()}
              subtitle={getMostRecent(clinicProcedures)?.name || 'procedures logged'}
              color={colors.clinic}
              onPress={() => navigation.navigate('Clinic')}
            />
          )}
        </View>

        {/* Getting Started */}
        {temperatures.length === 0 && periods.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Start Tracking Your Fertility</Text>
            <Text style={styles.emptyStateText}>
              Tap the + button above to add your first entry. Track your basal body temperature,
              period, medications, and more to gain insights into your fertility journey.
            </Text>
          </View>
        )}
      </ScrollView>

      <AddDataModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    ...typography.largeTitle,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonIcon: {
    fontSize: 28,
    color: colors.cardBackground,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  addButtonText: {
    ...typography.headline,
    color: colors.cardBackground,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title2,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateTitle: {
    ...typography.title2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;
