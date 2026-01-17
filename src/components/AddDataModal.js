import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const DATA_TYPES = [
  { id: 'temperature', label: 'Basal Body Temperature', icon: '🌡️' },
  { id: 'period', label: 'Period', icon: '🩸' },
  { id: 'sex', label: 'Intercourse', icon: '💕' },
  { id: 'medication', label: 'Medication', icon: '💊' },
  { id: 'ovulation_test', label: 'Ovulation Test', icon: '🔬' },
  { id: 'pregnancy_test', label: 'Pregnancy Test', icon: '🤰' },
  { id: 'clinic', label: 'Clinic Procedure', icon: '🏥' },
];

const AddDataModal = ({ visible, onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    if (selectedType && onSubmit) {
      onSubmit(selectedType, formData);
      setSelectedType(null);
      setFormData({});
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
    setFormData({});
    onClose();
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'temperature':
        return (
          <View>
            <Text style={styles.inputLabel}>Temperature (°C)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="36.5"
              value={formData.value}
              onChangeText={(value) => setFormData({ ...formData, value })}
            />
          </View>
        );

      case 'period':
        return (
          <View>
            <Text style={styles.inputLabel}>Period Start</Text>
            <Text style={styles.helperText}>
              Recording today as start date
            </Text>
          </View>
        );

      case 'sex':
        return (
          <View>
            <Text style={styles.inputLabel}>Intercourse</Text>
            <Text style={styles.helperText}>
              Recording today
            </Text>
          </View>
        );

      case 'medication':
        return (
          <View>
            <Text style={styles.inputLabel}>Medication Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Follistim"
              value={formData.name}
              onChangeText={(name) => setFormData({ ...formData, name })}
            />

            <Text style={styles.inputLabel}>Type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Injectable"
              value={formData.type}
              onChangeText={(type) => setFormData({ ...formData, type })}
            />

            <Text style={styles.inputLabel}>Dosage</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                keyboardType="decimal-pad"
                placeholder="Amount"
                value={formData.amount}
                onChangeText={(amount) => setFormData({ ...formData, amount })}
              />
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Unit (IU, mg)"
                value={formData.unit}
                onChangeText={(unit) => setFormData({ ...formData, unit })}
              />
            </View>
          </View>
        );

      case 'ovulation_test':
        return (
          <View>
            <Text style={styles.inputLabel}>Test Result</Text>
            <View style={styles.buttonGroup}>
              {['negative', 'positive', 'peak'].map((result) => (
                <TouchableOpacity
                  key={result}
                  style={[
                    styles.optionButton,
                    formData.result === result && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, result })}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      formData.result === result && styles.optionButtonTextSelected,
                    ]}
                  >
                    {result.charAt(0).toUpperCase() + result.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'pregnancy_test':
        return (
          <View>
            <Text style={styles.inputLabel}>Test Result</Text>
            <View style={styles.buttonGroup}>
              {['negative', 'positive'].map((result) => (
                <TouchableOpacity
                  key={result}
                  style={[
                    styles.optionButton,
                    formData.result === result && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, result })}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      formData.result === result && styles.optionButtonTextSelected,
                    ]}
                  >
                    {result.charAt(0).toUpperCase() + result.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'clinic':
        return (
          <View>
            <Text style={styles.inputLabel}>Procedure Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Egg Retrieval"
              value={formData.name}
              onChangeText={(name) => setFormData({ ...formData, name })}
            />

            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any notes"
              multiline
              numberOfLines={4}
              value={formData.notes}
              onChangeText={(notes) => setFormData({ ...formData, notes })}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {selectedType ? 'Add Data' : 'What do you want to track?'}
            </Text>
            {selectedType && (
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.content}>
            {!selectedType ? (
              <View style={styles.typeList}>
                {DATA_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={styles.typeButton}
                    onPress={() => setSelectedType(type.id)}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={styles.typeLabel}>{type.label}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.formContainer}>{renderForm()}</View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.text,
  },
  cancelButton: {
    ...typography.body,
    color: colors.secondary,
  },
  doneButton: {
    ...typography.headline,
    color: colors.secondary,
  },
  content: {
    flex: 1,
  },
  typeList: {
    padding: spacing.md,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  typeIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  typeLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  chevron: {
    ...typography.title2,
    color: colors.textSecondary,
  },
  formContainer: {
    padding: spacing.md,
  },
  inputLabel: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 0.5,
    borderColor: colors.separator,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputHalf: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.separator,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  optionButtonText: {
    ...typography.body,
    color: colors.text,
  },
  optionButtonTextSelected: {
    color: colors.cardBackground,
    fontWeight: '600',
  },
});

export default AddDataModal;
