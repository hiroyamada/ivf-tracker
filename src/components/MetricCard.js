import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const MetricCard = ({ title, value, unit, subtitle, color, onPress, chart }) => {
  const content = (
    <View style={[styles.card, onPress && styles.cardPressable]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.content}>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>

        {chart && <View style={styles.chartContainer}>{chart}</View>}
      </View>

      {color && <View style={[styles.colorBar, { backgroundColor: color }]} />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.card,
    overflow: 'hidden',
  },
  cardPressable: {
    borderWidth: 0.5,
    borderColor: colors.separator,
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    ...typography.largeTitle,
    color: colors.text,
  },
  unit: {
    ...typography.title2,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  chartContainer: {
    flex: 1,
    marginLeft: spacing.md,
    height: 60,
  },
  colorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
});

export default MetricCard;
