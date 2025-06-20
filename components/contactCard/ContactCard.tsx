import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ContactCardProps } from "./ContactCard.types";
import AddressListModal from "../address/addressListModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAddresses,
  removeAddress,
  saveAddress,
  setSelectedAddressId,
  updateAddress,
} from "@/store/address/addressSlice";
import AddEditAddressModal from "../address/addEditAddressModal";
import { Address, AddressFormData } from "@/interfaces";

const ContactCard: React.FC<ContactCardProps> = ({
  title,
  information,
  onEditPress,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAddressListModalOpen, setIsAddressListModalOpen] =
    useState<boolean>(false);
  const [isAddEditAddressModalOpen, setIsAddEditAddressModalOpen] =
    useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.address.selectedAddressId
  );

  const onChangeAddress = (id: string) => {
    dispatch(setSelectedAddressId(id));
    setIsAddressListModalOpen(false);
  };

  const onAddAddress = () => {
    setAddressToEdit(null);
    setIsAddressListModalOpen(false);
    setIsAddEditAddressModalOpen(true);
  };

  const onEditAddress = (address: Address) => {
    setAddressToEdit(address);
    setIsAddressListModalOpen(false);
    setIsAddEditAddressModalOpen(true);
  };

  const openAddressListModal = () => {
    setAddressToEdit(null);
    setIsAddEditAddressModalOpen(false);
    setIsAddressListModalOpen(true);
  };

  const onSubmitNewAddress = (
    address: AddressFormData,
    addressType: string
  ) => {
    dispatch(
      saveAddress({
        formData: address,
        addressType: addressType,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchAddresses());
        openAddressListModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onDeleteAddress = async (address: Address) => {
    try {
      await dispatch(removeAddress(address.id)).unwrap();
      await dispatch(fetchAddresses());
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const onUpdateAddress = (
    address: AddressFormData,
    addressType: string,
    addressId: string
  ) => {
    dispatch(
      updateAddress({
        formData: address,
        addressType: addressType,
        addressId: addressId,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchAddresses());
        openAddressListModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.infoWrapper}>
        <View style={styles.info}>
          {information.map((item, index) => (
            <Text key={index} style={styles.infoText}>
              {item}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.editIconWrapper}
          onPress={openAddressListModal}
        >
          <FontAwesome5 name="pen" size={16} color={staticColors.white} />
        </TouchableOpacity>
      </View>
      <AddressListModal
        visible={isAddressListModalOpen}
        onClose={() => setIsAddressListModalOpen(false)}
        addresses={addresses}
        onAddAddress={onAddAddress}
        onEditAddress={onEditAddress}
        selectedAddressId={selectedAddressId}
        onConfirmAddress={onChangeAddress}
        onDeleteAddress={onDeleteAddress}
      />
      <AddEditAddressModal
        visible={isAddEditAddressModalOpen}
        onClose={openAddressListModal}
        editAddress={addressToEdit}
        onEditAddress={onUpdateAddress}
        isEdit={addressToEdit ? true : false}
        onAddAddress={onSubmitNewAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.gray300,
    flexDirection: "column",
    ...spacingStyles.mt10,
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r16,
  },
  cardTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
  infoWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.mt4,
  },
  info: {
    width: "80%",
  },
  infoText: {
    fontFamily: fontFamilies.nunitoSans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
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

export default ContactCard;
