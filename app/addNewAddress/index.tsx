import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import spacingStyles from "@/style/spacingStyles";
import { commonStyles } from "@/style/commonStyle";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { RootState } from "@/store/store";
import {
  fetchAddressTypes,
  resetError,
  saveAddress,
  updateAddress,
  setAddressType,
  setIsDefault,
  setEditingAddress,
} from "@/store/address/addressSlice";
import { useAppDispatch } from "@/store/hooks";
import SelectAddress from "@/components/address/SelectAddress";
import { AddressFormData } from "@/types/types";

const AddNewAddress = () => {
  const dispatch = useAppDispatch();
  const { errors, handleFieldChange, resetErrors, setFieldErrors } =
    useFieldValidation();
  const {
    addressTypes,
    selectedAddressType,
    isDefault,
    loading,
    error,
    editingAddress,
  } = useSelector((state: RootState) => state.address);
  const [formData, setFormData] = useState<AddressFormData>({
    contact_name: editingAddress?.contact_name || "",
    contact_mobile: editingAddress?.contact_mobile || "",
    postal_code: editingAddress?.postal_code || "",
    line1: editingAddress?.line1 || "",
    line2: editingAddress?.line2 || "",
    city: editingAddress?.city || "",
    state: editingAddress?.state || "",
    country: editingAddress?.country || "",
  });
  const [showSelectAddress, setShowSelectAddress] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const notEmptyValidator = (value: string) => value.trim().length > 0;
  const isEditMode = !!editingAddress;

  useEffect(() => {
    dispatch(fetchAddressTypes());
    if (isEditMode) {
      dispatch(setAddressType(editingAddress.type));
      dispatch(setIsDefault(editingAddress.is_primary));
    }
  }, [dispatch, isEditMode, editingAddress]);

  useEffect(() => {
    if (error && typeof error === "object") {
      setFieldErrors(error);
      dispatch(resetError());
    }
  }, [error, dispatch, setFieldErrors]);

  useEffect(() => {
    return () => {
      dispatch(setEditingAddress(null));
    };
  }, [dispatch]);

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    handleFieldChange(field, value, notEmptyValidator, `${field} is required`);
  };

  const handleSave = () => {
    const fields: { name: keyof AddressFormData; value: string }[] = [
      { name: "contact_name", value: formData.contact_name },
      { name: "contact_mobile", value: formData.contact_mobile },
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

    const action = isEditMode
      ? updateAddress({
          addressId: editingAddress.id,
          formData,
          addressType: selectedAddressType,
          isDefault,
        })
      : saveAddress({
          formData,
          addressType: selectedAddressType,
          isDefault,
        });

    dispatch(action)
      .unwrap()
      .then(() => {
        setShowSelectAddress(true);
      })
      .catch((error) => {
        console.error(
          isEditMode ? "Failed to update address:" : "Failed to save address:",
          error
        );
      });
  };

  const handleInputFocus = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 100, animated: true });
    }
  };

  if (showSelectAddress) {
    return <SelectAddress onGoBack={() => setShowSelectAddress(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              resetErrors();
              dispatch(setEditingAddress(null));
              router.back();
            }}
            style={commonStyles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={staticColors.textDarkGray}
            />
          </TouchableOpacity>
          <Text style={commonStyles.header}>
            {isEditMode ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            <TextInput
              style={[styles.input, errors.contact_name && styles.inputError]}
              placeholder="Name*"
              placeholderTextColor={staticColors.textSecondary}
              value={formData.contact_name}
              onChangeText={(text) => handleInputChange("contact_name", text)}
              onFocus={handleInputFocus}
            />
            {errors.contact_name && (
              <Text style={styles.errorText}>{errors.contact_name}</Text>
            )}
            <TextInput
              style={[styles.input, errors.contact_mobile && styles.inputError]}
              placeholder="Mobile No*"
              placeholderTextColor={staticColors.textSecondary}
              keyboardType="numeric"
              value={formData.contact_mobile}
              onChangeText={(text) => handleInputChange("contact_mobile", text)}
              onFocus={handleInputFocus}
              maxLength={10}
            />
            {errors.contact_mobile && (
              <Text style={styles.errorText}>{errors.contact_mobile}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <TextInput
              style={[styles.input, errors.postal_code && styles.inputError]}
              placeholder="Pin Code*"
              placeholderTextColor={staticColors.textSecondary}
              keyboardType="numeric"
              value={formData.postal_code}
              onChangeText={(text) => handleInputChange("postal_code", text)}
              onFocus={handleInputFocus}
              maxLength={6}
            />
            {errors.postal_code && (
              <Text style={styles.errorText}>{errors.postal_code}</Text>
            )}
            <TextInput
              style={[styles.input, errors.line1 && styles.inputError]}
              placeholder="Address (House No., Building, Street, Area)*"
              placeholderTextColor={staticColors.textSecondary}
              value={formData.line1}
              onChangeText={(text) => handleInputChange("line1", text)}
              onFocus={handleInputFocus}
            />
            {errors.line1 && (
              <Text style={styles.errorText}>{errors.line1}</Text>
            )}
            <Text style={styles.noteText}>
              *Please update flat/house no and society/apartment details
            </Text>
            <TextInput
              style={[styles.input, errors.line2 && styles.inputError]}
              placeholder="Locality /Town*"
              placeholderTextColor={staticColors.textSecondary}
              value={formData.line2 || ""}
              onChangeText={(text) => handleInputChange("line2", text)}
              onFocus={handleInputFocus}
            />
            {errors.line2 && (
              <Text style={styles.errorText}>{errors.line2}</Text>
            )}
            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  errors.city && styles.inputError,
                ]}
                placeholder="City /District*"
                placeholderTextColor={staticColors.textSecondary}
                value={formData.city}
                onChangeText={(text) => handleInputChange("city", text)}
                onFocus={handleInputFocus}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  errors.state && styles.inputError,
                ]}
                placeholder="State*"
                placeholderTextColor={staticColors.textSecondary}
                value={formData.state}
                onChangeText={(text) => handleInputChange("state", text)}
                onFocus={handleInputFocus}
              />
            </View>
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}
            <TextInput
              style={[styles.input, errors.country && styles.inputError]}
              placeholder="Country*"
              placeholderTextColor={staticColors.textSecondary}
              value={formData.country}
              onChangeText={(text) => handleInputChange("country", text)}
              onFocus={handleInputFocus}
            />
            {errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Type</Text>
            <View style={styles.addressTypeContainer}>
              {addressTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.addressTypeOption}
                  onPress={() => dispatch(setAddressType(type))}
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
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => dispatch(setIsDefault(!isDefault))}
            >
              <View
                style={[styles.checkbox, isDefault && styles.checkboxSelected]}
              >
                {isDefault && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={staticColors.white}
                  />
                )}
              </View>
              <Text style={styles.checkboxText}>Make this as my default</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              resetErrors();
              dispatch(setEditingAddress(null));
              router.back();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  flex: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p10,
    backgroundColor: staticColors.white,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    ...spacingStyles.p10,
    ...spacingStyles.pb20,
  },
  section: {
    backgroundColor: staticColors.white,
    borderRadius: 10,
    ...spacingStyles.p10,
    ...spacingStyles.mb10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: fontSizes.sm,
    fontFamily: "HelveticaBold",
    ...spacingStyles.mb10,
  },
  input: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 5,
    ...spacingStyles.p10,
    ...spacingStyles.mb10,
    fontSize: fontSizes.sm,
    fontFamily: "Helvetica",
  },
  inputError: {
    borderColor: staticColors.errorColor,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mb10,
  },
  noteText: {
    fontSize: fontSizes.xs,
    color: staticColors.lightYellow,
    ...spacingStyles.mb10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  addressTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    ...spacingStyles.mb10,
  },
  addressTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mr20,
    ...spacingStyles.mb10,
  },
  addressTypeText: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: staticColors.black,
    borderRadius: 3,
    ...spacingStyles.mr10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: staticColors.primary,
    borderColor: staticColors.primary,
  },
  checkboxText: {
    fontSize: fontSizes.sm,
    fontFamily: "Helvetica",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.p10,
    backgroundColor: staticColors.white,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: staticColors.black,
    ...spacingStyles.py10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.py10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: staticColors.lightGray,
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    color: staticColors.white,
    fontFamily: "Helvetica",
  },
  cancelButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    color: staticColors.primary,
    fontFamily: "Helvetica",
  },
});

export default AddNewAddress;
