import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { getOvulationTests, getPregnancyTests } from '../utils/storage';
import { formatDate } from '../utils/helpers';

const TestsScreen = () => {
  const [ovulationTests, setOvulationTests] = useState([]);
  const [pregnancyTests, setPregnancyTests] = useState([]);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    const [ovTests, pregTests] = await Promise.all([
      getOvulationTests(),
      getPregnancyTests(),
    ]);
    setOvulationTests(ovTests);
    setPregnancyTests(pregTests);
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'positive':
      case 'peak':
        return colors.success;
      case 'negative':
        return colors.textSecondary;
      default:
        return colors.text;
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'positive':
      case 'peak':
        return '✓';
      case 'negative':
        return '−';
      default:
        return '?';
    }
  };

  const renderOvulationTest = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <View style={styles.testResult}>
          <View
            style={[
              styles.resultBadge,
              { backgroundColor: getResultColor(item.result) },
            ]}
          >
            <Text style={styles.resultIcon}>{getResultIcon(item.result)}</Text>
          </View>
          <View>
            <Text style={styles.resultText}>
              {item.result.charAt(0).toUpperCase() + item.result.slice(1)}
            </Text>
            <Text style={styles.testType}>Ovulation Test</Text>
          </View>
        </View>
        <Text style={styles.testDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  const renderPregnancyTest = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <View style={styles.testResult}>
          <View
            style={[
              styles.resultBadge,
              { backgroundColor: getResultColor(item.result) },
            ]}
          >
            <Text style={styles.resultIcon}>{getResultIcon(item.result)}</Text>
          </View>
          <View>
            <Text style={styles.resultText}>
              {item.result.charAt(0).toUpperCase() + item.result.slice(1)}
            </Text>
            <Text style={styles.testType}>Pregnancy Test</Text>
          </View>
        </View>
        <Text style={styles.testDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Results</Text>
        <Text style={styles.subtitle}>
          Track ovulation and pregnancy test results
        </Text>
      </View>

      {/* Summary */}
      {(ovulationTests.length > 0 || pregnancyTests.length > 0) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{ovulationTests.length}</Text>
              <Text style={styles.summaryLabel}>Ovulation Tests</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{pregnancyTests.length}</Text>
              <Text style={styles.summaryLabel}>Pregnancy Tests</Text>
            </View>
          </View>
        </View>
      )}

      {/* Ovulation Tests */}
      {ovulationTests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ovulation Tests</Text>
          <FlatList
            data={[...ovulationTests].reverse()}
            renderItem={renderOvulationTest}
            keyExtractor={(item, index) => `ov-${index}`}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Pregnancy Tests */}
      {pregnancyTests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pregnancy Tests</Text>
          <FlatList
            data={[...pregnancyTests].reverse()}
            renderItem={renderPregnancyTest}
            keyExtractor={(item, index) => `preg-${index}`}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Empty State */}
      {ovulationTests.length === 0 && pregnancyTests.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No test results yet. Add your first entry from the home screen.
          </Text>
        </View>
      )}
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.title1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.footnote,
    color: colors.textSecondary,
    textAlign: 'center',
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
  testResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  resultIcon: {
    fontSize: 20,
    color: colors.cardBackground,
    fontWeight: '700',
  },
  resultText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  testType: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  testDate: {
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

export default TestsScreen;
