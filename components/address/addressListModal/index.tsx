import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { AddressListModalProps } from "./AddressListModal.types";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Address } from "@/interfaces";
import { commonStyles } from "@/style/commonStyle";
import gapSizes from "@/style/gapSizes";

const AddressListModal: React.FC<AddressListModalProps> = ({
  visible,
  onClose,
  addresses,
  selectedAddressId,
  onEditAddress,
  onConfirmAddress,
  onAddAddress,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedAddressId || null
  );

  const handleSetShippingAddress = () => {
    if (onConfirmAddress && selectedId) {
      onConfirmAddress(selectedId);
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => {
    return (
      <View
        style={[
          styles.addressItem,
          selectedId === item.id && styles.selectedAddress,
        ]}
      >
        <TouchableOpacity
          style={styles.radioContainer}
          onPress={() => setSelectedId(item.id)}
        >
          <View
            style={[
              styles.radio,
              selectedId === item.id && styles.radioSelected,
            ]}
          >
            {selectedId === item.id && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
        <View style={styles.addressDetails}>
          <Text style={styles.addressName}>{item.contact_name}</Text>
          <Text style={styles.addressText}>{item.contact_number}</Text>
          <Text style={styles.addressText}>
            {item.line1} {item.line2}
          </Text>
          <Text style={styles.addressText}>
            {item.city}, {item.state} - {item.postal_code}, {item.country}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editIconWrapper}
          onPress={() => onEditAddress && onEditAddress(item)}
        >
          <FontAwesome5 name="pen" size={16} color={staticColors.white} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Modal visible={visible} animationType="none" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.heading}>Shipping Address</Text>
                <View style={styles.headerActions}>
                  {addresses && addresses.length > 0 && (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => onAddAddress && onAddAddress()}
                    >
                      <Ionicons
                        name="add"
                        size={24}
                        color={staticColors.white}
                      />
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons
                      name="close-circle-outline"
                      size={30}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {addresses && addresses.length > 0 ? (
                <View style={styles.container}>
                  <FlatList
                    data={addresses}
                    renderItem={renderAddressItem}
                    keyExtractor={(item, index) => item.id}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    ListFooterComponent={
                      <TouchableOpacity
                        style={[
                          styles.setAddressButton,
                          !selectedId && styles.disabledButton,
                        ]}
                        onPress={handleSetShippingAddress}
                        disabled={!selectedId}
                      >
                        <Text style={styles.setAddressButtonText}>
                          Set as Shipping Address
                        </Text>
                      </TouchableOpacity>
                    }
                  />
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.noAddressFound}>
                    No registered address found
                  </Text>
                  <TouchableOpacity
                    style={[styles.setAddressButton]}
                    onPress={() => onAddAddress && onAddAddress()}
                    disabled={!selectedId}
                  >
                    <Text style={styles.setAddressButtonText}>
                      Add an address
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
    alignItems: "center",
    backgroundColor: staticColors.modalOverlayLight,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: staticColors.white,
    height: "80%",
    width: "100%",
    position: "relative",
    borderTopLeftRadius: borderRadius.r30,
    borderTopRightRadius: borderRadius.r30,
  },
  header: {
    backgroundColor: staticColors.bgSoftBlue,
    borderTopLeftRadius: borderRadius.r30,
    borderTopRightRadius: borderRadius.r30,
    ...spacingStyles.px15,
    ...spacingStyles.py25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.xl,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.blue500,
    borderRadius: borderRadius.r12,
    ...spacingStyles.px12,
    ...spacingStyles.py5,
  },
  addButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayMedium,
  },
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px15,
    ...spacingStyles.py20,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
    ...spacingStyles.px10,
    ...spacingStyles.py15,
  },
  selectedAddress: {
    backgroundColor: staticColors.blue100,
    borderRadius: borderRadius.r10,
  },
  radioContainer: {
    ...spacingStyles.mr10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.circle,
    borderWidth: 2,
    borderColor: staticColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: staticColors.blue500,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.blue500,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
  },
  addressText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayRegular,
    color: staticColors.darkGray,
  },
  setAddressButton: {
    backgroundColor: staticColors.blue500,
    borderRadius: borderRadius.r10,
    alignItems: "center",
    ...spacingStyles.px20,
    ...spacingStyles.py10,
    ...spacingStyles.my10,
  },
  setAddressButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
  disabledButton: {
    backgroundColor: staticColors.gray200,
    opacity: 0.6,
  },
  editIconWrapper: {
    backgroundColor: staticColors.blue500,
    flexShrink: 0,
    borderRadius: borderRadius.circle,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: gapSizes.lg,
  },
  noAddressFound: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.darkGray,
  },
});

export default AddressListModal;
