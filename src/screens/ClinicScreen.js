import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { getClinicProcedures } from '../utils/storage';
import { formatDate } from '../utils/helpers';

const ClinicScreen = () => {
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = async () => {
    const procs = await getClinicProcedures();
    setProcedures(procs);
  };

  const renderProcedureItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <Text style={styles.procedureName}>{item.name}</Text>
        <Text style={styles.procedureDate}>{formatDate(item.date)}</Text>
      </View>
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clinic Procedures</Text>
        <Text style={styles.subtitle}>
          Track your IVF procedures and appointments
        </Text>
      </View>

      {/* Summary */}
      {procedures.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{procedures.length}</Text>
            <Text style={styles.summaryLabel}>Total Procedures</Text>
          </View>
        </View>
      )}

      {/* All Procedures */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Procedures</Text>
        {procedures.length > 0 ? (
          <FlatList
            data={[...procedures].reverse()}
            renderItem={renderProcedureItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No procedures logged yet. Add your first entry from the home screen.
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
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  summaryValue: {
    ...typography.title1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.footnote,
    color: colors.textSecondary,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  procedureName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  procedureDate: {
    ...typography.callout,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  notesContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.separator,
  },
  notesLabel: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    ...typography.callout,
    color: colors.text,
    lineHeight: 20,
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

export default ClinicScreen;
