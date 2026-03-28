import { AppText, TextField } from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { fromLocalDateString, toLocalDateString } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useRef } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (dateString: string) => void;
  error?: string;
}

export function DatePickerField({
  label,
  value,
  onChange,
  error,
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = React.useState(false);
  // Store the value before opening so Cancel can restore it on iOS
  const prevValueRef = useRef(value);

  const handleOpen = () => {
    prevValueRef.current = value;
    setShowPicker(true);
  };

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (selectedDate) {
        onChange(toLocalDateString(selectedDate));
      }
      return;
    }
    // iOS: update live as spinner turns
    if (selectedDate) {
      onChange(toLocalDateString(selectedDate));
    }
  };

  const handleDone = () => {
    setShowPicker(false);
  };

  const handleCancel = () => {
    onChange(prevValueRef.current);
    setShowPicker(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handleOpen}
        accessibilityLabel={`Select ${label}`}
        accessibilityRole="button"
      >
        <View pointerEvents="none">
          <TextField
            label={label}
            placeholder="YYYY-MM-DD"
            value={value}
            editable={false}
            error={error}
            rightIcon={
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.textSecondary}
              />
            }
          />
        </View>
      </TouchableOpacity>

      {showPicker &&
        (Platform.OS === "ios" ? (
          <Modal
            transparent
            animationType="slide"
            visible={showPicker}
            onRequestClose={handleCancel}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleCancel} hitSlop={styles.hitSlop}>
                    <AppText style={styles.cancelButtonText}>Cancel</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDone} hitSlop={styles.hitSlop}>
                    <AppText style={styles.doneButtonText}>Done</AppText>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={fromLocalDateString(value)}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                  textColor={colors.textPrimary}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={fromLocalDateString(value)}
            mode="date"
            display="default"
            onChange={handleChange}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    paddingBottom: spacing["2xl"],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 16,
  },
  doneButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
});
