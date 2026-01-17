import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { getPeriods } from '../utils/storage';
import {
  formatDate,
  predictNextPeriod,
  predictOvulation,
  getCurrentCycleDay,
  calculateAverageCycleLength,
} from '../utils/helpers';

const CycleScreen = () => {
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    const pers = await getPeriods();
    setPeriods(pers);
  };

  const nextPeriod = predictNextPeriod(periods);
  const ovulationDate = predictOvulation(periods);
  const cycleDay = getCurrentCycleDay(periods);
  const avgCycleLength = calculateAverageCycleLength(periods);

  const renderPeriodItem = ({ item }) => {
    const startDate = new Date(item.startDate);
    const endDate = item.endDate ? new Date(item.endDate) : null;
    const duration = endDate
      ? Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      : 'Ongoing';

    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContent}>
          <View>
            <Text style={styles.listItemValue}>
              {formatDate(item.startDate)}
              {endDate && ` - ${formatDate(item.endDate)}`}
            </Text>
            <Text style={styles.listItemDetail}>
              {typeof duration === 'number' ? `${duration} days` : duration}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cycle Tracking</Text>
        <Text style={styles.subtitle}>
          Track your menstrual cycle and predict fertile windows
        </Text>
      </View>

      {/* Current Cycle Info */}
      {periods.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Cycle</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cycle Day</Text>
              <Text style={styles.infoValue}>{cycleDay || '--'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Avg Cycle Length</Text>
              <Text style={styles.infoValue}>{avgCycleLength} days</Text>
            </View>
          </View>
        </View>
      )}

      {/* Predictions */}
      {nextPeriod && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Predictions</Text>

          <View style={styles.predictionItem}>
            <View style={[styles.predictionDot, { backgroundColor: colors.period }]} />
            <View style={styles.predictionContent}>
              <Text style={styles.predictionLabel}>Next Period</Text>
              <Text style={styles.predictionValue}>{formatDate(nextPeriod)}</Text>
            </View>
          </View>

          {ovulationDate && (
            <View style={styles.predictionItem}>
              <View style={[styles.predictionDot, { backgroundColor: colors.ovulation }]} />
              <View style={styles.predictionContent}>
                <Text style={styles.predictionLabel}>Predicted Ovulation</Text>
                <Text style={styles.predictionValue}>{formatDate(ovulationDate)}</Text>
              </View>
            </View>
          )}

          <Text style={styles.disclaimer}>
            Predictions are based on your cycle history and may vary.
          </Text>
        </View>
      )}

      {/* Period History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Period History</Text>
        {periods.length > 0 ? (
          <FlatList
            data={[...periods].reverse()}
            renderItem={renderPeriodItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No period data yet. Add your first entry from the home screen.
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
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  cardTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.title1,
    color: colors.text,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  predictionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  predictionContent: {
    flex: 1,
  },
  predictionLabel: {
    ...typography.body,
    color: colors.text,
  },
  predictionValue: {
    ...typography.callout,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  disclaimer: {
    ...typography.caption1,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
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
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  listItemDetail: {
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

export default CycleScreen;
