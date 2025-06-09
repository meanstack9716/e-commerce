import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { FontAwesome5 } from "@expo/vector-icons";
import { AddressItemProps } from "./AddressItem.types";

const AddressItem: React.FC<AddressItemProps> = ({
  address,
  selectedId,
  setSelectedId,
  onEditAddress,
}) => {
  return (
    <View
      style={[
        styles.addressItem,
        selectedId === address.id && styles.selectedAddress,
      ]}
    >
      <TouchableOpacity
        style={styles.radioContainer}
        onPress={() => setSelectedId(address.id)}
      >
        <View
          style={[
            styles.radio,
            selectedId === address.id && styles.radioSelected,
          ]}
        >
          {selectedId === address.id && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
      <View style={styles.addressDetails}>
        <Text style={styles.addressName}>{address.contact_name}</Text>
        <Text style={styles.addressText}>{address.contact_number}</Text>
        <Text style={styles.addressText}>
          {address.line1} {address.line2}
        </Text>
        <Text style={styles.addressText}>
          {address.city}, {address.state} - {address.postal_code},{" "}
          {address.country}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editIconWrapper}
        onPress={() => onEditAddress && onEditAddress(address)}
      >
        <FontAwesome5 name="pen" size={16} color={staticColors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default AddressItem;
