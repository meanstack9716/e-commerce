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
  setAddressType,
  setIsDefault,
} from "@/store/address/addressSlice";
import { useAppDispatch } from "@/store/hooks";
import SelectAddress from "@/components/address/SelectAddress";

const AddNewAddress = () => {
  const dispatch = useAppDispatch();
  const { errors, handleFieldChange, resetErrors, setFieldErrors } =
    useFieldValidation();
  const { addressTypes, selectedAddressType, isDefault, loading, error } =
    useSelector((state: RootState) => state.address);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pinCode: "",
    address: "",
    locality: "",
    city: "",
    state: "",
    country: "",
  });
  const [showSelectAddress, setShowSelectAddress] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const notEmptyValidator = (value: string) => value.trim().length > 0;

  useEffect(() => {
    dispatch(fetchAddressTypes());
  }, [dispatch]);

  useEffect(() => {
    if (error && typeof error === "object") {
      setFieldErrors(error);
      dispatch(resetError());
    }
  }, [error, dispatch, setFieldErrors]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    handleFieldChange(field, value, notEmptyValidator, `${field} is required`);
  };

  const handleSave = () => {
    const fields = [
      { name: "name", value: formData.name },
      { name: "mobile", value: formData.mobile },
      { name: "pinCode", value: formData.pinCode },
      { name: "address", value: formData.address },
      { name: "locality", value: formData.locality },
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

    dispatch(
      saveAddress({
        formData: {
          contact_name: formData.name,
          contact_mobile: formData.mobile,
          postal_code: formData.pinCode,
          line1: formData.address,
          line2: formData.locality,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        addressType: selectedAddressType,
        isDefault,
      })
    )
      .unwrap()
      .then(() => {
        setShowSelectAddress(true);
      })
      .catch((error) => {
        console.error("Failed to save address:", error);
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
          <Text style={commonStyles.header}>ADD NEW ADDRESS</Text>
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
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Name*"
              placeholderTextColor={staticColors.textSecondary}
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              onFocus={handleInputFocus}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            <TextInput
              style={[styles.input, errors.mobile && styles.inputError]}
              placeholder="Mobile No*"
              placeholderTextColor={staticColors.textSecondary}
              keyboardType="numeric"
              value={formData.mobile}
              onChangeText={(text) => handleInputChange("mobile", text)}
              onFocus={handleInputFocus}
              maxLength={12}
            />
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <TextInput
              style={[styles.input, errors.pinCode && styles.inputError]}
              placeholder="Pin Code*"
              placeholderTextColor={staticColors.textSecondary}
              keyboardType="numeric"
              value={formData.pinCode}
              onChangeText={(text) => handleInputChange("pinCode", text)}
              onFocus={handleInputFocus}
              maxLength={6}
            />
            {errors.pinCode && (
              <Text style={styles.errorText}>{errors.pinCode}</Text>
            )}
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              placeholder="Address (House No., Building, Street, Area)*"
              placeholderTextColor={staticColors.textSecondary}
              value={formData.address}
              onChangeText={(text) => handleInputChange("address", text)}
              onFocus={handleInputFocus}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
            <Text style={styles.noteText}>
              *Please update flat/house no and society/apartment details
            </Text>
            <TextInput
              style={[styles.input, errors.locality && styles.inputError]}
              placeholder="Locality /Town*"
              placeholderTextColor={staticColors.textSecondary}
              value={formData.locality}
              onChangeText={(text) => handleInputChange("locality", text)}
              onFocus={handleInputFocus}
            />
            {errors.locality && (
              <Text style={styles.errorText}>{errors.locality}</Text>
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
              {loading ? "Saving..." : "Save"}
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
    ...spacingStyles.mb10,
  },
  input: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 5,
    ...spacingStyles.p10,
    ...spacingStyles.mb10,
    fontSize: fontSizes.sm,
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
  },
  cancelButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    color: staticColors.primary,
  },
});

export default AddNewAddress;
