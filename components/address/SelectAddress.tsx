import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import { commonStyles } from "@/style/commonStyle";

interface Address {
  id: string;
  name: string;
  label: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mobile?: string;
}

const defaultAddress: Address = {
  id: "1",
  name: "Kaushaki Kumari",
  label: "HOME",
  addressLine: " Sector 11",
  city: "Noida",
  state: " Uttar Pradesh",
  pincode: "201301",
  mobile: "6206517046",
};

const otherAddress: Address = {
  id: "2",
  name: "kaushaki",
  label: "HOME",
  addressLine: "lakhisarai",
  city: "Dariapur",
  state: "",
  pincode: "811300",
};

const SelectAddressScreen = () => {
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress.id);
  const navigation = useNavigation();

  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={commonStyles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={staticColors.textDarkGray}
          />
        </TouchableOpacity>
        <Text style={commonStyles.header}>SELECT ADDRESS</Text>
      </View>

      <TouchableOpacity style={styles.addNewButton}>
        <Text style={styles.addNewText}>ADD NEW ADDRESS</Text>
      </TouchableOpacity>

      <ScrollView style={styles.addressList}>
        <Text style={styles.sectionTitle}>DEFAULT ADDRESS</Text>
        <AddressItem
          address={defaultAddress}
          selected={selectedAddressId === defaultAddress.id}
          onSelect={handleSelect}
          showEdit
        />

        {otherAddress?.addressLine ? (
          <>
            <Text style={styles.sectionTitle}>OTHER ADDRESS</Text>
            <AddressItem
              address={otherAddress}
              selected={selectedAddressId === otherAddress.id}
              onSelect={handleSelect}
            />
          </>
        ) : null}
      </ScrollView>

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>CONFIRM</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

interface AddressItemProps {
  address: Address;
  selected: boolean;
  onSelect: (id: string) => void;
  showEdit?: boolean;
}

const AddressItem: React.FC<AddressItemProps> = ({
  address,
  selected,
  onSelect,
  showEdit,
}) => {
  return (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => onSelect(address.id)}
    >
      <View style={styles.row}>
        <View style={commonStyles.radioOuter}>
          {selected && <View style={commonStyles.radioInner} />}
        </View>
        <Text style={styles.name}>{address.name}</Text>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{address.label}</Text>
        </View>
      </View>
      <Text style={styles.addressLine}>{address.addressLine}</Text>
      <Text style={styles.addressLine}>{address.city}</Text>
      <Text style={styles.addressLine}>
        {address.state} {address.pincode}
      </Text>
      {address.mobile && (
        <Text style={styles.mobile}>Mobile: {address.mobile}</Text>
      )}
      {showEdit && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>REMOVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>EDIT</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.p10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  addNewButton: {
    borderWidth: 1,
    borderColor: staticColors.black,
    ...spacingStyles.p10,
    alignItems: "center",
    ...spacingStyles.my10,
    borderRadius: 5,
  },
  addNewText: { fontWeight: "bold" },
  sectionTitle: { fontWeight: "bold", ...spacingStyles.my10 },
  addressList: { flex: 1 },
  addressItem: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 10,
    ...spacingStyles.p10,
    ...spacingStyles.mb10,
  },
  row: { flexDirection: "row", alignItems: "center", ...spacingStyles.mb5 },

  name: { fontWeight: "bold", fontSize: fontSizes.sm },
  labelContainer: {
    backgroundColor: staticColors.lightGreen,
    ...spacingStyles.px10,
    ...spacingStyles.py2,
    borderRadius: 15,
    ...spacingStyles.ml10,
  },
  label: { fontSize: fontSizes.s, color: staticColors.darkGreen },
  addressLine: {
    fontSize: fontSizes.xs,
    color: staticColors.textSecondary,
  },
  mobile: {
    fontSize: fontSizes.sm,
    ...spacingStyles.mt5,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    ...spacingStyles.mt10,
  },
  editButton: {
    borderWidth: 1,
    borderColor: staticColors.black,
    ...spacingStyles.py5,
    ...spacingStyles.px10,
    borderRadius: 5,
    ...spacingStyles.mr10,
  },
  buttonText: {
    fontSize: fontSizes.s,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.py10,
    alignItems: "center",
    borderRadius: 6,
    ...spacingStyles.mt5,
  },
  confirmText: {
    color: staticColors.white,
    fontSize: fontSizes.sm,
  },
});

export default SelectAddressScreen;
