import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";

const ProductDetails = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Check Delivery</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PIN Code"
        placeholderTextColor={staticColors.primaryColor}
      />
      <View style={styles.option}>
        <MaterialIcons name="local-shipping" size={20} color="#000" />
        <Text>
          <Text style={styles.boldText}>Express delivery</Text> might be
          available
        </Text>
      </View>
      <View style={styles.option}>
        <MaterialIcons name="payment" size={20} color="#000" />
        <Text>
          <Text style={styles.boldText}>Pay on delivery</Text> might be
          available
        </Text>
      </View>
      <View style={styles.option}>
        <MaterialIcons name="refresh" size={20} color="#000" />
        <Text>
          <Text style={styles.boldText}>Hassle free 7, 15 and 30 days</Text>{" "}
          Return & Exchange might be available
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Fabric</Text>
          <Text style={styles.subTitle}>Pattern</Text>
        </View>
        <View style={styles.row}>
          <Text>Cotton</Text>
          <Text>Solid</Text>
        </View>
        <View style={styles.sectiontable}>
          <Text style={styles.tableTitle}>Product Details</Text>
          <View>
            <Text>• White top</Text>
            <Text>• Solid</Text>
            <Text>• Shirt collar neck, Sleeveless</Text>
            <Text>• Knitted cotton</Text>
            <Text>• Button closure</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Size & Fit</Text>
        <Text>The model (height 5'8") is wearing a size S</Text>

        <Text style={styles.sectionTitle}>Material & Care</Text>
        <Text>98% cotton, 2% elastane</Text>
        <Text>Machine wash</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    ...spacingStyles.py5,
    color: staticColors.primaryColor,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    ...spacingStyles.py25,
    color: staticColors.primaryColor,
  },
  input: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 10,
    ...spacingStyles.p10,
    ...spacingStyles.mb15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  sectiontable: {
    flexDirection: "column",
    gap: 20,
    ...spacingStyles.py10,
  },
  details: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 20,
    ...spacingStyles.p15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTitle: {
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default ProductDetails;
