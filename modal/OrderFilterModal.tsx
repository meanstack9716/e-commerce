import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { fetchStatusTypes } from "@/store/order/orderSlice";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { commonStyles } from "@/style/commonStyle";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { fontSizes, fontWeights } from "@/style/typography";
import { Ionicons } from "@expo/vector-icons";

interface FilterValues {
  status: string;
  time: string;
  dateRange: string;
}

interface OrderFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

const OrderFilterModal: React.FC<OrderFilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const dispatch = useAppDispatch();
  const { statusTypes, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedTime, setSelectedTime] = useState<string>("Anytime");

  useEffect(() => {
    if (visible) {
      dispatch(fetchStatusTypes());
    }
  }, [visible, dispatch]);

  const timeOptions: string[] = [
    "Anytime",
    "Last 30 days",
    "Last 6 months",
    "Last year",
  ];

  const getDateRange = (timeOption: string): string => {
    const today = new Date();
    let startDate = new Date(today);
    if (timeOption === "Last 30 days") {
      startDate.setDate(today.getDate() - 30);
      return `${startDate.toLocaleDateString("en-IN")} - ${today.toLocaleDateString("en-IN")}`;
    } else if (timeOption === "Last 6 months") {
      startDate.setMonth(today.getMonth() - 6);
      return `${startDate.toLocaleDateString("en-IN")} - ${today.toLocaleDateString("en-IN")}`;
    } else if (timeOption === "Last year") {
      startDate.setFullYear(today.getFullYear() - 1);
      return `${startDate.toLocaleDateString("en-IN")} - ${today.toLocaleDateString("en-IN")}`;
    }
    return "All time";
  };

  const handleClearFilters = (): void => {
    setSelectedStatus("All");
    setSelectedTime("Anytime");
  };

  const handleApply = (): void => {
    const filters: FilterValues = {
      status: selectedStatus,
      time: selectedTime,
      dateRange: getDateRange(selectedTime),
    };
    onApply(filters);
    onClose();
  };
  if (error) return <Text>Error: {error}</Text>;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Filter Orders</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={staticColors.darkGray} />
            </TouchableOpacity>
          </View>
          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>Status</Text>
            {["All", ...statusTypes].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => setSelectedStatus(option)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedStatus === option }}
                accessibilityLabel={option}
              >
                <View
                  style={[
                    commonStyles.radioOuter,
                    selectedStatus === option &&
                      commonStyles.radioOuterSelected,
                  ]}
                >
                  {selectedStatus === option && (
                    <View style={commonStyles.radioInner} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            {/* Time Section */}
            <Text style={styles.sectionTitle}>Time</Text>
            {timeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => setSelectedTime(option)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedTime === option }}
                accessibilityLabel={option}
              >
                <View
                  style={[
                    commonStyles.radioOuter,
                    selectedTime === option && commonStyles.radioOuterSelected,
                  ]}
                >
                  {selectedTime === option && (
                    <View style={commonStyles.radioInner} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Fixed Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearButtonText}>CLEAR FILTERS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: staticColors.modalOverlayLight,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: staticColors.white,
    ...spacingStyles.p20,
    borderTopLeftRadius: borderRadius.r20,
    borderTopRightRadius: borderRadius.r20,
    height: "72%",
    flexDirection: "column",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    ...spacingStyles.px20,
    ...spacingStyles.py10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.px10,
  },
  headerText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  closeIcon: {
    fontSize: fontSizes["2xl"],
    color: staticColors.darkGray,
  },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.py5,
  },
  optionText: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.pt10,
    borderTopWidth: 1,
    borderTopColor: staticColors.lightGray,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: staticColors.primary,
    ...spacingStyles.py10,
    ...spacingStyles.px20,
    borderRadius: borderRadius.r5,
    flex: 1,
    ...spacingStyles.mr10,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: fontSizes.sm,
    color: staticColors.primary,
    fontWeight: fontWeights.semiBold,
  },
  applyButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.py10,
    ...spacingStyles.px20,
    borderRadius: borderRadius.r5,
    flex: 1,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: fontSizes.sm,
    color: staticColors.white,
    fontWeight: fontWeights.semiBold,
  },
});

export default OrderFilterModal;
