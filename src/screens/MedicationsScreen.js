import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { getMedications } from '../utils/storage';
import { formatDate } from '../utils/helpers';

const MedicationsScreen = () => {
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    const meds = await getMedications();
    setMedications(meds);
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationType}>{item.type}</Text>
      </View>
      <View style={styles.listItemContent}>
        <View style={styles.dosageContainer}>
          <Text style={styles.dosageLabel}>Dosage:</Text>
          <Text style={styles.dosageValue}>
            {item.amount} {item.unit}
          </Text>
        </View>
        <Text style={styles.medicationDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  // Group medications by name
  const medicationSummary = medications.reduce((acc, med) => {
    if (!acc[med.name]) {
      acc[med.name] = {
        name: med.name,
        type: med.type,
        count: 0,
        totalDoses: 0,
        unit: med.unit,
      };
    }
    acc[med.name].count += 1;
    acc[med.name].totalDoses += parseFloat(med.amount) || 0;
    return acc;
  }, {});

  const summaryData = Object.values(medicationSummary);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medications</Text>
        <Text style={styles.subtitle}>
          Track your IVF medications and dosages
        </Text>
      </View>

      {/* Summary */}
      {summaryData.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          {summaryData.map((med, index) => (
            <View key={index} style={styles.summaryItem}>
              <View>
                <Text style={styles.summaryName}>{med.name}</Text>
                <Text style={styles.summaryType}>{med.type}</Text>
              </View>
              <View style={styles.summaryStats}>
                <Text style={styles.summaryCount}>{med.count} doses</Text>
                <Text style={styles.summaryTotal}>
                  Total: {med.totalDoses.toFixed(1)} {med.unit}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* All Entries */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Entries</Text>
        {medications.length > 0 ? (
          <FlatList
            data={[...medications].reverse()}
            renderItem={renderMedicationItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No medications logged yet. Add your first entry from the home screen.
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  summaryName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  summaryType: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryStats: {
    alignItems: 'flex-end',
  },
  summaryCount: {
    ...typography.callout,
    color: colors.text,
  },
  summaryTotal: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  listItemHeader: {
    marginBottom: spacing.sm,
  },
  medicationName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  medicationType: {
    ...typography.caption1,
    color: colors.textSecondary,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dosageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dosageLabel: {
    ...typography.callout,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  dosageValue: {
    ...typography.callout,
    color: colors.text,
    fontWeight: '600',
  },
  medicationDate: {
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

export default MedicationsScreen;
