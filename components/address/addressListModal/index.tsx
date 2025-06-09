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
import { Ionicons } from "@expo/vector-icons";
import { Address } from "@/interfaces";
import gapSizes from "@/style/gapSizes";
import AddressItem from "../addressItem";

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
      <AddressItem
        address={item}
        onEditAddress={onEditAddress}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
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
