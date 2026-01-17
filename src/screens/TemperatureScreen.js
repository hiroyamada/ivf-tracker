import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import LineChart from '../components/LineChart';
import { getTemperatures } from '../utils/storage';
import { formatDate, getRecentData } from '../utils/helpers';

const TemperatureScreen = () => {
  const [temperatures, setTemperatures] = useState([]);

  useEffect(() => {
    loadTemperatures();
  }, []);

  const loadTemperatures = async () => {
    const temps = await getTemperatures();
    setTemperatures(temps);
  };

  const recentTemps = getRecentData(temperatures, 30);
  const chartData = recentTemps.map(t => parseFloat(t.value));
  const chartLabels = recentTemps.map((t, i) => {
    if (i % 5 === 0) {
      const date = new Date(t.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return '';
  });

  const renderTemperatureItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemValue}>{item.value}°C</Text>
        <Text style={styles.listItemDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Basal Body Temperature</Text>
        <Text style={styles.subtitle}>
          Your temperature at rest when you wake up in the morning
        </Text>
      </View>

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Last 30 Days</Text>
          <LineChart
            data={chartData}
            labels={chartLabels}
            color={colors.temperature}
            yAxisSuffix="°C"
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Entries</Text>
        {temperatures.length > 0 ? (
          <FlatList
            data={[...temperatures].reverse()}
            renderItem={renderTemperatureItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No temperature data yet. Add your first entry from the home screen.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.title1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  chartContainer: {
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.md,
  },
  listItem: {
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemValue: {
    ...typography.title3,
    color: colors.text,
  },
  listItemDate: {
    ...typography.callout,
    color: colors.textSecondary,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default TemperatureScreen;
