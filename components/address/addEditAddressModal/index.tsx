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

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
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
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Name</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors.contact_name && styles.inputError,
                        ]}
                        placeholder="Enter contact name"
                        placeholderTextColor={staticColors.textSecondary}
                        value={formData.contact_name}
                        onChangeText={(text) =>
                          handleInputChange("contact_name", text)
                        }
                      />
                      {errors.contact_name && (
                        <Text style={styles.errorText}>
                          {errors.contact_name}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Mobile Number</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors.contact_number && styles.inputError,
                        ]}
                        placeholder="Enter contact number"
                        placeholderTextColor={staticColors.textSecondary}
                        value={formData.contact_number}
                        onChangeText={(text) =>
                          handleInputChange("contact_number", text)
                        }
                        maxLength={10}
                        keyboardType="numeric"
                      />
                      {errors.contact_number && (
                        <Text style={styles.errorText}>
                          {errors.contact_number}
                        </Text>
                      )}
                    </View>
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

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>
                        Address Street Line 1
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors.line1 && styles.inputError,
                        ]}
                        placeholder="Enter House No., Building, Street, Area"
                        placeholderTextColor={staticColors.textSecondary}
                        value={formData.line1}
                        onChangeText={(text) =>
                          handleInputChange("line1", text)
                        }
                      />
                      {errors.line1 && (
                        <Text style={styles.errorText}>{errors.line1}</Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>
                        Address Street Line 2
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors.line2 && styles.inputError,
                        ]}
                        placeholder="Enter locality/ town"
                        placeholderTextColor={staticColors.textSecondary}
                        value={formData.line2 ?? ""}
                        onChangeText={(text) =>
                          handleInputChange("line2", text)
                        }
                      />
                      {errors.line2 && (
                        <Text style={styles.errorText}>{errors.line2}</Text>
                      )}
                    </View>

                    <View style={styles.row}>
                      <View style={styles.halfInputContainer}>
                        <Text style={styles.inputLabel}>City</Text>
                        <TextInput
                          style={[
                            styles.input,
                            errors.city && styles.inputError,
                          ]}
                          placeholder="Enter city/district"
                          placeholderTextColor={staticColors.textSecondary}
                          value={formData.city}
                          onChangeText={(text) =>
                            handleInputChange("city", text)
                          }
                        />
                        {errors.city && (
                          <Text style={styles.errorText}>{errors.city}</Text>
                        )}
                      </View>

                      <View style={styles.halfInputContainer}>
                        <Text style={styles.inputLabel}>Pin code</Text>
                        <TextInput
                          style={[
                            styles.input,
                            errors.postal_code && styles.inputError,
                          ]}
                          placeholder="Enter pin code"
                          placeholderTextColor={staticColors.textSecondary}
                          value={formData.postal_code}
                          onChangeText={(text) =>
                            handleInputChange("postal_code", text)
                          }
                          maxLength={6}
                          keyboardType="numeric"
                        />
                        {errors.postal_code && (
                          <Text style={styles.errorText}>
                            {errors.postal_code}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>State</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors.state && styles.inputError,
                        ]}
                        placeholder="Enter state"
                        placeholderTextColor={staticColors.textSecondary}
                        value={formData.state ?? ""}
                        onChangeText={(text) =>
                          handleInputChange("state", text)
                        }
                      />
                      {errors.state && (
                        <Text style={styles.errorText}>{errors.state}</Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Country</Text>
                      <TextInput
                        style={[styles.disableInput]}
                        placeholderTextColor={staticColors.textSecondary}
                        value={formData.country}
                        onChangeText={(text) =>
                          handleInputChange("country", text)
                        }
                        editable={false}
                      />
                      {errors.contact_name && (
                        <Text style={styles.errorText}>{errors.country}</Text>
                      )}
                    </View>

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
  inputContainer: {
    ...spacingStyles.pt10,
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mb8,
  },
  input: {
    borderWidth: 1,
    borderColor: staticColors.inputBg,
    borderRadius: borderRadius.r8,
    backgroundColor: staticColors.inputBg,
    ...spacingStyles.pt10,
    ...spacingStyles.px10,
  },
  disableInput: {
    backgroundColor: staticColors.white,
    color: staticColors.textDarkGray,
  },
  inputError: {
    borderColor: staticColors.errorColor,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mt5,
    ...spacingStyles.mb10,
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
