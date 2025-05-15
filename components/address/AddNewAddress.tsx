import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import { commonStyles } from "@/style/commonStyle";

const AddNewAddress = () => {
  const navigation = useNavigation();
  const [addressType, setAddressType] = useState("HOME");
  const [isDefault, setIsDefault] = useState(false);

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
        <Text style={commonStyles.header}>ADD NEW ADDRESS</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Name*"
            placeholderTextColor={staticColors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile No*"
            placeholderTextColor={staticColors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Pin Code*"
            placeholderTextColor={staticColors.textSecondary}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Address (House No., Building, Street, Area)*"
            placeholderTextColor={staticColors.textSecondary}
          />
          <Text style={styles.noteText}>
            *Please update flat/house no and society/apartment details
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Locality /Town*"
            placeholderTextColor={staticColors.textSecondary}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City /District*"
              placeholderTextColor={staticColors.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State*"
              placeholderTextColor={staticColors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Type</Text>
          <View style={styles.addressTypeContainer}>
            <TouchableOpacity
              style={styles.addressTypeOption}
              onPress={() => setAddressType("HOME")}
            >
              <View style={commonStyles.radioOuter}>
                {addressType === "HOME" && (
                  <View style={commonStyles.radioInner} />
                )}
              </View>
              <Text style={styles.addressTypeText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addressTypeOption}
              onPress={() => setAddressType("OFFICE")}
            >
              <View style={commonStyles.radioOuter}>
                {addressType === "OFFICE" && (
                  <View style={commonStyles.radioInner} />
                )}
              </View>
              <Text style={styles.addressTypeText}>Office</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsDefault(!isDefault)}
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
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p10,
    ...spacingStyles.mb10,
  },
  scrollView: {
    flex: 1,
    ...spacingStyles.px10,
  },
  section: {
    backgroundColor: staticColors.white,
    borderRadius: 10,
    ...spacingStyles.p10,
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
    ...spacingStyles.mb10,
  },
  addressTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mr20,
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
