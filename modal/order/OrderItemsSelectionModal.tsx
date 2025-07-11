import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes } from "@/style/typography";
import { OrderItemsSelectionModalProps } from "./OrderItemsSelectionModal.types";

const OrderItemsSelectionModal: React.FC<OrderItemsSelectionModalProps> = ({
  visible,
  onClose,
  order,
  onSelectItem,
}) => {
  if (!order || !order.items) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            {/* Top Close Icon */}
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={24} color={staticColors.black} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Select Item to Review</Text>
            <Text style={styles.modalSubtitle}>Order #{order.id}</Text>

            <ScrollView contentContainerStyle={styles.itemsContainer}>
              {order.items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.itemContainer}
                  onPress={() =>
                    onSelectItem(item.product.id, item.product.title)
                  }
                >
                  <Image
                    source={{
                      uri:
                        item.gallery?.[0]?.img_url ||
                        item.product.thumbnail_url ||
                        "",
                    }}
                    style={styles.itemImage}
                  />
                  <Text style={styles.itemTitle}>{item.product.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    backgroundColor: staticColors.white,
    width: "90%",
    maxHeight: "45%",
    borderRadius: borderRadius.r20,
    ...spacingStyles.px20,
    ...spacingStyles.py10,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 10,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: fontSizes.l,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb10,
  },
  modalSubtitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb15,
  },
  itemsContainer: {
    ...spacingStyles.pb10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
    ...spacingStyles.p10,
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: borderRadius.r10,
  },
  itemImage: {
    width: 75,
    height: 55,
    borderRadius: borderRadius.r10,
    ...spacingStyles.mr10,
    resizeMode: "cover",
  },
  itemTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayMedium,
    color: staticColors.black,
    flex: 1,
  },
});

export default OrderItemsSelectionModal;
