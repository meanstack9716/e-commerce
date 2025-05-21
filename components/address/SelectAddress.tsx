import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import {
  fetchAddresses,
  setSelectedAddressId,
  removeAddress,
  setEditingAddress,
} from "@/store/address/addressSlice";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import FullScreenLoader from "../common/FullScreenLoader";
import { commonStyles } from "@/style/commonStyle";

interface Address {
  id: string;
  contact_name: string | null;
  contact_mobile: string | null;
  type: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
}

interface SelectAddressProps {
  onGoBack?: () => void;
}

const SelectAddress = ({ onGoBack }: SelectAddressProps) => {
  const dispatch = useAppDispatch();
  const { addresses, selectedAddressId, loading, error } = useSelector(
    (state: RootState) => state.address
  );

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleSelect = (id: string) => {
    dispatch(setSelectedAddressId(id));
  };

  const handleAddNewAddress = () => {
    dispatch(setEditingAddress(null));
    router.push("/addNewAddress");
  };
    const handleEditAddress = (address: Address) => {
    dispatch(setEditingAddress(address));
    router.push("/addNewAddress");
  };

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      router.back();
    }
  };

  const handleConfirm = () => {
    router.push("/placeorder")
  };

  const handleRemove = (id: string) => {
    dispatch(removeAddress(id));
  };

  const primaryAddress = addresses.find((addr) => addr.is_primary);
  const otherAddresses = addresses.filter((addr) => !addr.is_primary);

  return (
    <>
      <FullScreenLoader visible={loading} />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={staticColors.black} />
          </TouchableOpacity>
          <Text style={styles.header}>SELECT ADDRESS</Text>
        </View>

        {error && <Text style={styles.errorText}>{error.general}</Text>}

        <TouchableOpacity
          style={styles.addNewButton}
          onPress={handleAddNewAddress}
        >
          <Text style={styles.addNewText}>ADD NEW ADDRESS</Text>
        </TouchableOpacity>

        <ScrollView style={styles.addressList}>
          {primaryAddress && (
            <>
              <Text style={styles.sectionTitle}>DEFAULT ADDRESS</Text>
              <AddressCard
                address={primaryAddress}
                selected={selectedAddressId === primaryAddress.id}
                onSelect={handleSelect}
                onRemove={handleRemove}
                onEdit={handleEditAddress}
              />
            </>
          )}

          {otherAddresses.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>OTHER ADDRESS</Text>
              {otherAddresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  selected={selectedAddressId === address.id}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                  onEdit={handleEditAddress}
                />
              ))}
            </>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

interface AddressItemProps {
  address: Address;
  selected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (address: Address) => void;
}

const AddressCard: React.FC<AddressItemProps> = ({
  address,
  selected,
  onSelect,
  onRemove,
  onEdit,
}) => {
  return (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => onSelect(address.id)}
    >
      <View style={styles.row}>
        <View
          style={[commonStyles.radioOuter, selected && styles.radioOuterSelected]}
        >
          {selected && <View style={commonStyles.radioInner} />}
        </View>
        <Text style={styles.name}>{address.contact_name || "Unknown"}</Text>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{address.type}</Text>
        </View>
      </View>
      <Text style={styles.addressLine}>{address.line1}</Text>
      {address.line2 && <Text style={styles.addressLine}>{address.line2}</Text>}
      <Text style={styles.addressLine}>{address.city}</Text>
      <Text style={styles.addressLine}>
        {address.state}, {address.postal_code}
      </Text>
      {address.contact_mobile && (
        <Text style={styles.mobile}>Mobile: {address.contact_mobile}</Text>
      )}
      {selected && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onRemove(address.id)}
          >
            <Text style={styles.buttonText}>REMOVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}  onPress={() => onEdit(address)}>
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
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
   ...spacingStyles.pr5
  },
  header: {
    flex: 1,
    fontSize: fontSizes.base,
    fontWeight: "bold",
    color: staticColors.black,
  },
  addNewButton: {
    borderWidth: 1,
    borderColor: staticColors.black,
    ...spacingStyles.p10,
    alignItems: "center",
    ...spacingStyles.my10,
    borderRadius: 5,
  },
  addNewText: {
    fontWeight: "bold",
    fontSize: fontSizes.sm,
    color: staticColors.black,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: fontSizes.sm,
    color: staticColors.black,
   ...spacingStyles.mb10
  },
  addressList: {
    flex: 1,
  },
  addressItem: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioOuterSelected: {
    borderColor: staticColors.discountText,
  },
  name: {
    fontWeight: "bold",
    fontSize: fontSizes.sm,
    color: staticColors.black,
  },
  labelContainer: {
    backgroundColor: staticColors.lightGreen,
    ...spacingStyles.px10,
    ...spacingStyles.py2,
    borderRadius:8,
    ...spacingStyles.ml10
  },
  label: {
    fontSize: fontSizes.s,
    color: staticColors.darkGreen,
    fontWeight: "bold",
  },
  addressLine: {
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
    lineHeight: 20,
  },
  mobile: {
    fontSize: 14,
    color: staticColors.textDarkGray,
    ...spacingStyles.mt5,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    ...spacingStyles.mt5
  },
  editButton: {
    borderWidth: 1,
    borderColor: staticColors.black,
    ...spacingStyles.px15,
   ...spacingStyles.py5,
    borderRadius: 5,
    ...spacingStyles.mr10
  },
  buttonText: {
    fontSize: fontSizes.s,
    fontWeight: "bold",
    color: staticColors.black,
  },
  confirmButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.p10,
    alignItems: "center",
    borderRadius: 6,
    ...spacingStyles.mt5
  },
  confirmText: {
    color: staticColors.white,
    fontSize: fontSizes.sm,
    fontWeight: "bold",
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
    ...spacingStyles.mb10
  }
});

export default SelectAddress;
