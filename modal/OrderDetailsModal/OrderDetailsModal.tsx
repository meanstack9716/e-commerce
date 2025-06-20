import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { OrderDetailsModalProps } from "./OrderDetailsModal.types";
import gapSizes from "@/style/gapSizes";

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  visible,
  order,
  onClose,
  onReturn,
  onExchange,
}) => {
  if (!order) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.crossButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={staticColors.black} />
              </TouchableOpacity>

              <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Order #{order.id}</Text>

                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemBox}>
                    <View style={styles.inlineRow}>
                      <Text style={styles.label}>Product Name:</Text>
                      <Text style={styles.value}>{item.product.title}</Text>
                    </View>

                    <View style={styles.inlineRow}>
                      <Text style={styles.label}>Selected Size:</Text>
                      <Text style={styles.value}>{item.selected_size}</Text>
                    </View>

                    <View style={styles.inlineRow}>
                      <Text style={styles.label}>Selected Color:</Text>
                      <Text style={styles.value}>
                        {item.selected_color_name}
                      </Text>
                    </View>

                    <View style={styles.inlineRow}>
                      <Text style={styles.label}>Quantity:</Text>
                      <Text style={styles.value}>{item.quantity}</Text>
                    </View>

                    {item.product.price && (
                      <View style={styles.inlineRow}>
                        <Text style={styles.label}>Price:</Text>
                        <Text style={styles.value}>₹{item.product.price}</Text>
                      </View>
                    )}
                  </View>
                ))}

                <View style={styles.inlineRow}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={styles.value}>{order.status}</Text>
                </View>
              </ScrollView>

              <View style={styles.footerButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onReturn}
                >
                  <Text style={styles.actionButtonText}>Return</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onExchange}
                >
                  <Text style={styles.actionButtonText}>Exchange</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: staticColors.white,
    borderTopLeftRadius: borderRadius.r10,
    borderTopRightRadius: borderRadius.r10,
    maxHeight: "90%",
    ...spacingStyles.pb20,
    ...spacingStyles.px20,
    ...spacingStyles.pt20,
  },
  crossButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  content: {
    ...spacingStyles.py15,
  },
  title: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.mb10,
  },
  itemBox: {
    ...spacingStyles.mb15,
    borderBottomWidth: 1,
    borderColor: staticColors.lightGray,
    ...spacingStyles.pb10,
  },
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    ...spacingStyles.mb5,
  },
  label: {
    fontSize: fontSizes.sm,
    color: staticColors.textDarkGray,
    fontFamily: fontFamilies.nunitoSans,
    ...spacingStyles.mr5,
  },
  value: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.mt10,
    gap: gapSizes.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: staticColors.primaryBlue,
    ...spacingStyles.px10,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r5,
    alignItems: "center",
  },
  actionButtonText: {
    color: staticColors.white,
    fontFamily: fontFamilies.ralewayBold,
  },
});

export default OrderDetailsModal;
