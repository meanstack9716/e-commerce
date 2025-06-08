import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { Ionicons } from "@expo/vector-icons";
import { Address, AddressFormData } from "@/interfaces";
import { commonStyles } from "@/style/commonStyle";
import gapSizes from "@/style/gapSizes";
import { AddEditAddressModalProps } from "./AddEditAddressModal.types";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchAddressTypes,
  resetError,
  setAddressType,
} from "@/store/address/addressSlice";
import TextFieldWithLabel from "@/components/common/textFieldWithLabel";

const AddEditAddressModal: React.FC<AddEditAddressModalProps> = ({
  visible,
  onClose,
  isEdit = false,
  editAddress,
  onEditAddress,
  onAddAddress,
}) => {
  const dispatch = useAppDispatch();

  const { errors, handleFieldChange, resetErrors, setFieldErrors } =
    useFieldValidation();
  const notEmptyValidator = (value: string) => value.trim().length > 0;
  const { addressTypes, loading, error } = useSelector(
    (state: RootState) => state.address
  );

  const [formData, setFormData] = useState<AddressFormData>({
    contact_name: editAddress?.contact_name || "",
    contact_number: editAddress?.contact_number || "",
    postal_code: editAddress?.postal_code || "",
    line1: editAddress?.line1 || "",
    line2: editAddress?.line2 || "",
    city: editAddress?.city || "",
    state: editAddress?.state || "",
    country: editAddress?.country || "India",
    is_primary: editAddress?.is_primary || false,
  });
  const [selectedAddressType, setSelectedAddressTye] = useState<string>(
    addressTypes.length ? addressTypes[0] : "Home"
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    handleFieldChange(field, value, notEmptyValidator, `${field} is required`);
  };

  const handleDefaultChange = () => {
    setFormData((prev) => ({ ...prev, is_primary: !formData.is_primary }));
  };

  const handleSubmit = () => {
    const fields: { name: keyof AddressFormData; value: string }[] = [
      { name: "contact_name", value: formData.contact_name },
      { name: "contact_number", value: formData.contact_number },
      { name: "postal_code", value: formData.postal_code },
      { name: "line1", value: formData.line1 },
      { name: "line2", value: formData.line2 || "" },
      { name: "city", value: formData.city },
      { name: "state", value: formData.state },
      { name: "country", value: formData.country },
    ];

    let hasErrors = false;
    fields.forEach((field) => {
      handleFieldChange(
        field.name,
        field.value,
        notEmptyValidator,
        `${field.name} is required`
      );
      if (!field.value.trim()) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      return;
    }
    if (isEdit && onEditAddress && editAddress) {
      onEditAddress(formData, selectedAddressType, editAddress.id);
    } else if (!isEdit && onAddAddress) {
      onAddAddress(formData, selectedAddressType);
    }
  };

  useEffect(() => {
    dispatch(fetchAddressTypes());
    resetErrors();
    if (visible) {
      setFormData({
        contact_name: editAddress?.contact_name || "",
        contact_number: editAddress?.contact_number || "",
        postal_code: editAddress?.postal_code || "",
        line1: editAddress?.line1 || "",
        line2: editAddress?.line2 || "",
        city: editAddress?.city || "",
        state: editAddress?.state || "",
        country: editAddress?.country || "India",
        is_primary: editAddress?.is_primary || false,
      });
      setSelectedAddressTye(addressTypes.length ? addressTypes[0] : "Home");
    }
  }, [visible, editAddress]);

  useEffect(() => {
    if (error && typeof error === "object") {
      setFieldErrors(error);
      dispatch(resetError());
    }
  }, [error, dispatch, setFieldErrors]);

  return (
    <Modal visible={visible} animationType="none" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.heading}>
                  {isEdit ? "Edit " : "Add "}Shipping Address
                </Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons
                      name="close-circle-outline"
                      size={30}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formContainer}>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Details</Text>
                    <TextFieldWithLabel
                      label="Name"
                      value={formData.contact_name}
                      field="contact_name"
                      placeholder="Enter contact name"
                      onChangeText={(field, text) =>
                        handleInputChange(field, text)
                      }
                      errorMessage={errors.contact_name}
                    />

                    <TextFieldWithLabel
                      label="Mobile Number"
                      value={formData.contact_name}
                      field="contact_number"
                      placeholder="Enter contact number"
                      onChangeText={(field, text) =>
                        handleInputChange(field, text)
                      }
                      errorMessage={errors.contact_number}
                      isNumeric={true}
                      maxLength={10}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Address Type</Text>
                    <View style={styles.addressTypeContainer}>
                      {addressTypes.slice(0, 2).map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={styles.addressTypeOption}
                          onPress={() => setSelectedAddressTye(type)}
                        >
                          <View style={commonStyles.radioOuter}>
                            {selectedAddressType === type && (
                              <View style={commonStyles.radioInner} />
                            )}
                          </View>
                          <Text style={styles.addressTypeText}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Addres Details</Text>

                    <TextFieldWithLabel
                      label="Address Street Line 1"
                      value={formData.line1}
                      field="line1"
                      placeholder="Enter House No., Building, Street, Area"
                      onChangeText={(field, text) =>
                        handleInputChange(field, text)
                      }
                      errorMessage={errors.line1}
                    />

                    <TextFieldWithLabel
                      label="Address Street Line 2"
                      value={formData.line2 ?? ""}
                      field="line2"
                      placeholder="Enter locality/ town"
                      onChangeText={(field, text) =>
                        handleInputChange(field, text)
                      }
                      errorMessage={errors.line2}
                    />

                    <TextFieldWithLabel
                      label="City"
                      value={formData.city}
                      field="city"
                      placeholder="Enter city/district"
                      onChangeText={(field, text) =>
                        handleInputChange(field, text)
                      }
                      errorMessage={errors.city}
                    />

                    <View style={styles.row}>
                      <View style={styles.halfInputContainer}>
                        <TextFieldWithLabel
                          label="City"
                          value={formData.city}
                          field="city"
                          placeholder="Enter city/district"
                          onChangeText={(field, text) =>
                            handleInputChange(field, text)
                          }
                          errorMessage={errors.city}
                        />
                      </View>

                      <View style={styles.halfInputContainer}>
                        <TextFieldWithLabel
                          label="Pin code"
                          value={formData.postal_code}
                          field="postal_code"
                          placeholder="Enter pin code"
                          onChangeText={(field, text) =>
                            handleInputChange(field, text)
                          }
                          errorMessage={errors.postal_code}
                          isNumeric={true}
                          maxLength={6}
                        />
                      </View>
                    </View>

                    <TextFieldWithLabel
                      label="State"
                      value={formData.state}
                      field="state"
                      placeholder="Enter state"
                      onChangeText={(field, text) =>
                        handleInputChange(field, text)
                      }
                      errorMessage={errors.state}
                    />

                    <TextFieldWithLabel
                      label="Country"
                      value={formData.country}
                      field="country"
                      onChangeText={(field, text) =>
                        handleInputChange(field, text)
                      }
                      errorMessage={errors.country}
                      isEditable={false}
                    />

                    <View style={styles.checkBoxSection}>
                      <TouchableOpacity onPress={() => handleDefaultChange()}>
                        <View
                          style={[
                            styles.checkbox,
                            formData.is_primary && styles.checkboxChecked,
                          ]}
                        >
                          {formData.is_primary && (
                            <Text style={styles.checkmark}>✔</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text style={styles.inputLabel}>Is Default</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.setAddressButton,
                      loading && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    <Text style={styles.setAddressButtonText}>
                      {isEdit ? "Update Address" : "Add Address"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px15,
    ...spacingStyles.py20,
  },
  formContainer: {
    ...spacingStyles.pb50,
  },
  section: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.px5,
    ...spacingStyles.pb5,
    ...spacingStyles.mb10,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.mb10,
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mb8,
  },
  row: {
    flexDirection: "row",
    gap: gapSizes.md,
    justifyContent: "space-between",
  },
  halfInputContainer: {
    width: "48%",
    ...spacingStyles.pt10,
  },
  setAddressButton: {
    backgroundColor: staticColors.blue500,
    borderRadius: borderRadius.r10,
    alignItems: "center",
    ...spacingStyles.px20,
    ...spacingStyles.py15,
    ...spacingStyles.mb30,
    ...spacingStyles.mt15,
  },
  setAddressButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },

  addressTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  addressTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mr20,
  },
  addressTypeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    fontFamily: fontFamilies.helvetica,
  },
  saveButtonDisabled: {
    backgroundColor: staticColors.lightGray,
    opacity: 0.7,
  },
  checkBoxSection: {
    flexDirection: "row",
    ...spacingStyles.pt10,
    gap: gapSizes.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    backgroundColor: staticColors.white,
    borderColor: staticColors.black,
    borderRadius: borderRadius.r4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: staticColors.white,
    fontSize: fontSizes.xs,
  },
  checkboxChecked: {
    backgroundColor: staticColors.blue500,
    borderColor: staticColors.blue500,
  },
});

export default AddEditAddressModal;
